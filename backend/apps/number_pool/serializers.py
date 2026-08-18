from rest_framework import serializers

from .models import Country, NumberPool

from django.contrib.auth import get_user_model

from apps.clients.models import Client
from apps.carriers.models import Carrier, Termination


User = get_user_model()


# =========================================================
# COUNTRY SERIALIZER
# =========================================================

class CountrySerializer(serializers.ModelSerializer):

    class Meta:

        model = Country

        fields = "__all__"

        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
        )


# =========================================================
# NUMBER POOL SERIALIZER
# =========================================================

class NumberPoolSerializer(serializers.ModelSerializer):

    admin_name = serializers.CharField(
        source="admin.full_name",
        read_only=True,
    )

    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    carrier_name = serializers.CharField(
        source="carrier.name",
        read_only=True,
    )

    termination_name = serializers.CharField(
        source="termination.name",
        read_only=True,
    )

    country_name = serializers.CharField(
        source="country.name",
        read_only=True,
    )

    dial_code = serializers.CharField(
        source="country.dial_code",
        read_only=True,
    )

    class Meta:

        model = NumberPool

        fields = [
            "id",

            # ADMIN
            "admin",
            "admin_name",

            # CLIENT
            "client",
            "client_name",

            # CARRIER
            "carrier",
            "carrier_name",

            # TERMINATION
            "termination",
            "termination_name",

            # COUNTRY
            "country",
            "country_name",
            "dial_code",

            # NUMBER
            "did_number",

            # PRICING
            "purchase_price",
            "monthly_rental",

            # STATUS
            "status",
            "assigned_at",

            # DESCRIPTION
            "description",

            # SYSTEM
            "created_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = (
            "id",

            "created_by",
            "created_at",
            "updated_at",

            "admin_name",
            "client_name",

            "carrier_name",
            "termination_name",

            "country_name",
            "dial_code",
        )

        extra_kwargs = {

            "admin": {
                "required": False,
                "allow_null": True,
            },

            "client": {
                "required": False,
                "allow_null": True,
            },

            "carrier": {
                "required": False,
                "allow_null": True,
            },

            "termination": {
                "required": False,
                "allow_null": True,
            },

            "country": {
                "required": True,
            },

            "purchase_price": {
                "required": False,
            },

            "monthly_rental": {
                "required": False,
            },

            "assigned_at": {
                "required": False,
                "allow_null": True,
            },

            "description": {
                "required": False,
                "allow_blank": True,
            },
        }

    # =====================================================
    # DID VALIDATION
    # =====================================================

    def validate_did_number(self, value):

        queryset = NumberPool.objects.filter(
            did_number=value
        )

        if self.instance:

            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(
                "This DID number already exists."
            )

        return value

    # =====================================================
    # CARRIER → TERMINATION VALIDATION
    # =====================================================

    def validate(self, attrs):

        carrier = attrs.get(
            "carrier",
            getattr(
                self.instance,
                "carrier",
                None,
            ),
        )

        termination = attrs.get(
            "termination",
            getattr(
                self.instance,
                "termination",
                None,
            ),
        )

        if termination and carrier:

            if termination.carrier_id != carrier.id:

                raise serializers.ValidationError(
                    {
                        "termination":
                        "Selected termination does not "
                        "belong to selected carrier."
                    }
                )

        elif termination and not carrier:

            existing_carrier = getattr(
                self.instance,
                "carrier",
                None,
            )

            if existing_carrier:

                if (
                    termination.carrier_id
                    != existing_carrier.id
                ):

                    raise serializers.ValidationError(
                        {
                            "termination":
                            "Selected termination does not "
                            "belong to the number's carrier."
                        }
                    )

        return attrs


# =========================================================
# BULK ALLOCATION SERIALIZER
# =========================================================
#
# Frontend payload:
#
# {
#     "number_ids": [1, 2, 3],
#     "carrier": 1,
#     "termination": 5,
#     "client": 10
# }
#
# =========================================================

class BulkAllocationSerializer(serializers.Serializer):

    number_ids = serializers.ListField(

        child=serializers.IntegerField(
            min_value=1
        ),

        allow_empty=False,
    )

    carrier = serializers.PrimaryKeyRelatedField(

        queryset=Carrier.objects.filter(
            is_active=True,
        )
    )

    termination = serializers.PrimaryKeyRelatedField(

        queryset=Termination.objects.filter(
            is_active=True,
        )
    )

    client = serializers.PrimaryKeyRelatedField(

        queryset=Client.objects.filter(
            is_active=True,
        )
    )

    # =====================================================
    # VALIDATE NUMBER IDS
    # =====================================================

    def validate_number_ids(self, value):

        # -------------------------------------------------
        # REMOVE DUPLICATES
        # -------------------------------------------------

        value = list(
            dict.fromkeys(value)
        )

        # -------------------------------------------------
        # FETCH SELECTED NUMBERS
        # -------------------------------------------------

        numbers = NumberPool.objects.filter(
            id__in=value
        )

        # -------------------------------------------------
        # CHECK MISSING IDS
        # -------------------------------------------------

        existing_ids = set(
            numbers.values_list(
                "id",
                flat=True
            )
        )

        missing_ids = [

            number_id

            for number_id in value

            if number_id not in existing_ids

        ]

        if missing_ids:

            raise serializers.ValidationError(
                f"Number IDs not found: {missing_ids}"
            )

        # -------------------------------------------------
        # CHECK AVAILABILITY
        # -------------------------------------------------

        unavailable_numbers = list(

            numbers
            .exclude(
                status="AVAILABLE"
            )
            .values_list(
                "did_number",
                flat=True
            )

        )

        if unavailable_numbers:

            raise serializers.ValidationError(
                {
                    "number_ids":
                    "These numbers are not available: "
                    + ", ".join(
                        unavailable_numbers
                    )
                }
            )

        return value

    # =====================================================
    # VALIDATE CARRIER + TERMINATION
    # =====================================================

    def validate(self, attrs):

        carrier = attrs["carrier"]

        termination = attrs["termination"]

        # -------------------------------------------------
        # TERMINATION MUST BELONG TO CARRIER
        # -------------------------------------------------

        if termination.carrier_id != carrier.id:

            raise serializers.ValidationError(
                {
                    "termination":
                    "Selected termination does not "
                    "belong to selected carrier."
                }
            )

        return attrs


# =========================================================
# BULK UNALLOCATION SERIALIZER
# =========================================================
#
# Frontend payload:
#
# {
#     "number_ids": [1, 2, 3]
# }
#
# =========================================================

class BulkUnallocationSerializer(serializers.Serializer):

    number_ids = serializers.ListField(

        child=serializers.IntegerField(
            min_value=1
        ),

        allow_empty=False,
    )

    # =====================================================
    # VALIDATE NUMBER IDS
    # =====================================================

    def validate_number_ids(self, value):

        # -------------------------------------------------
        # REMOVE DUPLICATES
        # -------------------------------------------------

        value = list(
            dict.fromkeys(value)
        )

        # -------------------------------------------------
        # CHECK NUMBERS EXIST
        # -------------------------------------------------

        existing_ids = set(

            NumberPool.objects
            .filter(
                id__in=value
            )
            .values_list(
                "id",
                flat=True
            )

        )

        missing_ids = [

            number_id

            for number_id in value

            if number_id not in existing_ids

        ]

        if missing_ids:

            raise serializers.ValidationError(
                f"Number IDs not found: {missing_ids}"
            )

        # -------------------------------------------------
        # CHECK ASSIGNED NUMBERS
        # -------------------------------------------------

        assigned_ids = set(

            NumberPool.objects
            .filter(
                id__in=value,
                status="ASSIGNED",
            )
            .values_list(
                "id",
                flat=True
            )

        )

        not_assigned = [

            number_id

            for number_id in value

            if number_id not in assigned_ids

        ]

        if not_assigned:

            raise serializers.ValidationError(
                {
                    "number_ids":
                    "Some selected numbers are not assigned."
                }
            )

        return value


# =========================================================
# AUTO ASSIGN SERIALIZER
# =========================================================
#
# Used by separate Assign Numbers page.
#
# Frontend payload:
#
# {
#     "carrier": 1,
#     "termination": 5,
#     "client": 10,
#     "quantity": 20,
#     "prefix": "",
#     "payment_term": "Weekly"
# }
#
# =========================================================

class AutoAssignSerializer(serializers.Serializer):

    carrier = serializers.PrimaryKeyRelatedField(

        queryset=Carrier.objects.filter(
            is_active=True,
        )
    )

    termination = serializers.PrimaryKeyRelatedField(

        queryset=Termination.objects.filter(
            is_active=True,
        ),

        required=False,

        allow_null=True,
    )

    client = serializers.PrimaryKeyRelatedField(

        queryset=Client.objects.filter(
            is_active=True,
        )
    )

    quantity = serializers.IntegerField(
        min_value=1,
    )

    prefix = serializers.CharField(

        required=False,

        allow_blank=True,

        allow_null=True,
    )

    payment_term = serializers.ChoiceField(

        choices=Termination.PAYMENT_TERMS,

        required=False,

        allow_blank=True,

        allow_null=True,
    )

    # =====================================================
    # VALIDATION
    # =====================================================

    def validate(self, attrs):

        carrier = attrs["carrier"]

        termination = attrs.get(
            "termination"
        )

        payment_term = attrs.get(
            "payment_term"
        )

        # -------------------------------------------------
        # TERMINATION → CARRIER CHECK
        # -------------------------------------------------

        if termination:

            if termination.carrier_id != carrier.id:

                raise serializers.ValidationError(
                    {
                        "termination":
                        "Selected termination does not "
                        "belong to selected carrier."
                    }
                )

        # -------------------------------------------------
        # TERMINATION PAYMENT TERM
        # -------------------------------------------------

        if termination:

            termination_payment_term = (
                termination.payment_term
            )

            # If frontend did not send payment term,
            # automatically use termination's payment term.

            if not payment_term:

                attrs["payment_term"] = (
                    termination_payment_term
                )

            # If frontend sent a payment term,
            # it must match the termination.

            elif payment_term != termination_payment_term:

                raise serializers.ValidationError(
                    {
                        "payment_term":
                        "Selected payment term does not "
                        "match the selected termination."
                    }
                )

        # -------------------------------------------------
        # PREFIX
        # -------------------------------------------------

        prefix = attrs.get(
            "prefix"
        )

        if prefix:

            attrs["prefix"] = prefix.strip()

        # -------------------------------------------------
        # QUANTITY
        # -------------------------------------------------

        quantity = attrs.get(
            "quantity"
        )

        if quantity <= 0:

            raise serializers.ValidationError(
                {
                    "quantity":
                    "Quantity must be greater than zero."
                }
            )

        return attrs