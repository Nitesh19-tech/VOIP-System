from rest_framework import serializers

from apps.number_pool.models import NumberPool

from .models import InboundRoute


class InboundRouteSerializer(serializers.ModelSerializer):

    termination_name = serializers.CharField(
        source="termination.name",
        read_only=True,
    )

    carrier_name = serializers.CharField(
        source="termination.carrier.name",
        read_only=True,
    )

    class Meta:

        model = InboundRoute

        fields = (
            "id",
            "did",
            "description",
            "forward_number",
            "termination",
            "termination_name",
            "carrier_name",
            "priority",
            "enabled",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "termination_name",
            "carrier_name",
            "created_at",
            "updated_at",
        )

    # =====================================================
    # DID
    # =====================================================

    def validate_did(self, value):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "DID is required."
            )

        number = (
            NumberPool.objects
            .select_related(
                "carrier",
                "termination",
                "client",
            )
            .filter(
                did_number=value,
            )
            .first()
        )

        if not number:

            raise serializers.ValidationError(
                "This DID does not exist in Number Pool."
            )

        # -------------------------------------------------
        # DISABLED
        # -------------------------------------------------

        if number.status == "DISABLED":

            raise serializers.ValidationError(
                "This DID is disabled in Number Pool."
            )

        return value

    # =====================================================
    # FORWARD NUMBER
    # =====================================================

    def validate_forward_number(self, value):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "Forward number is required."
            )

        normalized = value.replace(
            "+",
            "",
            1,
        )

        if not normalized.isdigit():

            raise serializers.ValidationError(
                "Forward number must contain only digits "
                "and may start with '+'."
            )

        if len(normalized) < 7 or len(normalized) > 15:

            raise serializers.ValidationError(
                "Forward number must contain between "
                "7 and 15 digits."
            )

        return value

    # =====================================================
    # GENERAL VALIDATION
    # =====================================================

    def validate(self, attrs):

        # -------------------------------------------------
        # GET TERMINATION
        # -------------------------------------------------

        termination = attrs.get(
            "termination",
            getattr(
                self.instance,
                "termination",
                None,
            ),
        )

        if termination is None:

            raise serializers.ValidationError(
                {
                    "termination": (
                        "Termination is required "
                        "for an inbound route."
                    )
                }
            )

        # -------------------------------------------------
        # TERMINATION ACTIVE
        # -------------------------------------------------

        if not termination.is_active:

            raise serializers.ValidationError(
                {
                    "termination": (
                        "Selected termination is inactive."
                    )
                }
            )

        # -------------------------------------------------
        # CARRIER ACTIVE
        # -------------------------------------------------

        if not termination.carrier.is_active:

            raise serializers.ValidationError(
                {
                    "termination": (
                        "Selected termination's carrier "
                        "is inactive."
                    )
                }
            )

        # -------------------------------------------------
        # GET DID
        # -------------------------------------------------

        did = attrs.get(
            "did",
            getattr(
                self.instance,
                "did",
                None,
            ),
        )

        if not did:

            raise serializers.ValidationError(
                {
                    "did": (
                        "DID is required."
                    )
                }
            )

        # -------------------------------------------------
        # NUMBER POOL LOOKUP
        # -------------------------------------------------

        number = (
            NumberPool.objects
            .select_related(
                "carrier",
                "termination",
                "client",
            )
            .filter(
                did_number=did,
            )
            .first()
        )

        if not number:

            raise serializers.ValidationError(
                {
                    "did": (
                        "Selected DID does not exist "
                        "in Number Pool."
                    )
                }
            )

        # -------------------------------------------------
        # DISABLED DID
        # -------------------------------------------------

        if number.status == "DISABLED":

            raise serializers.ValidationError(
                {
                    "did": (
                        "Selected DID is disabled "
                        "in Number Pool."
                    )
                }
            )

        # -------------------------------------------------
        # DID MUST BE ASSIGNED
        # -------------------------------------------------

        if number.status != "ASSIGNED":

            raise serializers.ValidationError(
                {
                    "did": (
                        "Selected DID must be assigned "
                        "before creating an inbound route."
                    )
                }
            )

        # -------------------------------------------------
        # DID MUST HAVE TERMINATION
        # -------------------------------------------------

        if not number.termination:

            raise serializers.ValidationError(
                {
                    "did": (
                        "Selected DID does not have "
                        "a termination assigned."
                    )
                }
            )

        # -------------------------------------------------
        # DID → TERMINATION CONSISTENCY
        # -------------------------------------------------

        if number.termination_id != termination.id:

            raise serializers.ValidationError(
                {
                    "termination": (
                        "Selected termination does not "
                        "match the termination assigned "
                        "to this DID."
                    )
                }
            )

        # -------------------------------------------------
        # DID → CARRIER CONSISTENCY
        # -------------------------------------------------

        if number.carrier_id:

            if (
                termination.carrier_id
                != number.carrier_id
            ):

                raise serializers.ValidationError(
                    {
                        "termination": (
                            "Selected termination belongs "
                            "to a different carrier than "
                            "the DID."
                        )
                    }
                )

        return attrs