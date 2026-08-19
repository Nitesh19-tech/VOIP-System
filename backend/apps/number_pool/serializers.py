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
        default="",
    )

    carrier_name = serializers.CharField(
        source="carrier.name",
        read_only=True,
        default="",
    )

    termination_name = serializers.CharField(
        source="termination.name",
        read_only=True,
        default="",
    )

    country_name = serializers.CharField(
        source="country.name",
        read_only=True,
        default="",
    )

    dial_code = serializers.CharField(
        source="country.dial_code",
        read_only=True,
        default="",
    )

    # =====================================================
    # PREVIOUS PANEL / ADD NUMBER
    # =====================================================

    number = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
    )

    number_mode = serializers.ChoiceField(
        choices=NumberPool.NUMBER_MODE_CHOICES,
        required=False,
        default="SINGLE",
    )

    number_type = serializers.ChoiceField(
        choices=NumberPool.NUMBER_TYPE_CHOICES,
        required=False,
        default="GENERAL",
    )

    length = serializers.IntegerField(
        required=False,
        min_value=1,
        default=1,
        write_only=True,
    )

    number_list = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        write_only=True,
    )

    csv_numbers = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        write_only=True,
    )

    set_test_number = serializers.BooleanField(
        required=False,
        default=False,
        write_only=True,
    )

    daily_max_call = serializers.IntegerField(
        required=False,
        min_value=0,
        default=0,
    )

    daily_max_duration = serializers.IntegerField(
        required=False,
        min_value=0,
        default=0,
    )

    number_service = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
    )

    service_variables = serializers.JSONField(
        required=False,
        default=dict,
    )

    # =====================================================
    # META
    # =====================================================

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
            "number",

            # ADD OPTIONS
            "number_mode",
            "number_type",
            "length",
            "number_list",
            "csv_numbers",
            "set_test_number",

            "total_numbers",
            "daily_max_call",
            "daily_max_duration",

            "number_service",
            "service_variables",
            "is_test_number",

            # CSV / PRICING
            "range_name",
            "qty",
            "currency",
            "payterm",
            "payout",
            "daily",
            "weekly",
            "weekly7",
            "monthly30",
            "monthly45",
            "monthly60",
            "prefix",

            # SYSTEM
            "purchase_price",
            "monthly_rental",
            "status",
            "assigned_at",
            "description",

            # TIMESTAMPS
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
                "required": False,
                "allow_null": True,
            },

            "did_number": {
                "required": False,
                "allow_blank": True,
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

        if not value:
            return value

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
    # GENERAL VALIDATION
    # =====================================================

    def validate(self, attrs):

        mode = attrs.get(
            "number_mode",
            getattr(
                self.instance,
                "number_mode",
                "SINGLE",
            ),
        )

        number = attrs.get("number")
        did_number = attrs.get("did_number")

        # -------------------------------------------------
        # SINGLE
        # -------------------------------------------------

        if mode == "SINGLE":

            if not number and not did_number:

                raise serializers.ValidationError({
                    "number": "Number is required."
                })

        # -------------------------------------------------
        # RANGE
        # -------------------------------------------------

        elif mode == "RANGE":

            if not number and not did_number:

                raise serializers.ValidationError({
                    "number": "First Number is required."
                })

            length = attrs.get(
                "length",
                1,
            )

            if length < 1:

                raise serializers.ValidationError({
                    "length":
                    "Total Numbers must be greater than zero."
                })

        # -------------------------------------------------
        # LIST
        # -------------------------------------------------

        elif mode == "LIST":

            number_list = attrs.get(
                "number_list"
            )

            if not number_list and not number:

                raise serializers.ValidationError({
                    "number_list":
                    "Number list is required."
                })

        # -------------------------------------------------
        # CSV
        # -------------------------------------------------

        elif mode == "CSV":

            csv_numbers = attrs.get(
                "csv_numbers"
            )

            number_list = attrs.get(
                "number_list"
            )

            if not csv_numbers and not number_list:

                raise serializers.ValidationError({
                    "csv_numbers":
                    "CSV numbers are required."
                })

        # -------------------------------------------------
        # CARRIER / TERMINATION
        # -------------------------------------------------

        carrier = attrs.get(
            "carrier"
        )

        termination = attrs.get(
            "termination"
        )

        if carrier and termination:

            if termination.carrier_id != carrier.id:

                raise serializers.ValidationError({
                    "termination":
                    "Selected termination does not "
                    "belong to selected carrier."
                })

        # -------------------------------------------------
        # SERVICE VARIABLES
        # -------------------------------------------------

        service_variables = attrs.get(
            "service_variables"
        )

        if service_variables is None:

            attrs["service_variables"] = {}

        elif not isinstance(
            service_variables,
            dict,
        ):

            raise serializers.ValidationError({
                "service_variables":
                "Service variables must be a JSON object."
            })

        # -------------------------------------------------
        # TEST NUMBER
        # -------------------------------------------------

        if attrs.get(
            "set_test_number",
            False,
        ):

            attrs["number_type"] = "TEST"
            attrs["is_test_number"] = True

        else:

            if "number_type" not in attrs:

                attrs["number_type"] = "GENERAL"

        # -------------------------------------------------
        # TOTAL NUMBERS
        # -------------------------------------------------

        if mode == "RANGE":

            attrs["total_numbers"] = attrs.get(
                "length",
                1,
            )

        elif mode == "LIST":

            number_list = attrs.get(
                "number_list"
            ) or []

            attrs["total_numbers"] = len(
                number_list
            )

        elif mode == "CSV":

            csv_numbers = attrs.get(
                "csv_numbers"
            ) or attrs.get(
                "number_list"
            ) or []

            attrs["total_numbers"] = len(
                csv_numbers
            )

        else:

            attrs["total_numbers"] = 1

        return attrs


# =========================================================
# BULK ALLOCATION SERIALIZER
# =========================================================

class BulkAllocationSerializer(serializers.Serializer):

    number_ids = serializers.ListField(
        child=serializers.IntegerField(
            min_value=1
        ),
        allow_empty=False,
    )

    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.filter(
            is_active=True
        ),
        required=False,
        allow_null=True,
    )

    def validate_number_ids(self, value):

        value = list(
            dict.fromkeys(value)
        )

        numbers = NumberPool.objects.filter(
            id__in=value
        )

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

        unavailable_numbers = list(
            numbers.exclude(
                status="AVAILABLE"
            ).values_list(
                "did_number",
                flat=True
            )
        )

        if unavailable_numbers:

            raise serializers.ValidationError({
                "number_ids":
                "These numbers are not available: "
                + ", ".join(
                    unavailable_numbers
                )
            })

        return value


# =========================================================
# BULK UNALLOCATION SERIALIZER
# =========================================================

class BulkUnallocationSerializer(serializers.Serializer):

    number_ids = serializers.ListField(
        child=serializers.IntegerField(
            min_value=1
        ),
        allow_empty=False,
    )

    def validate_number_ids(self, value):

        value = list(
            dict.fromkeys(value)
        )

        existing_ids = set(
            NumberPool.objects.filter(
                id__in=value
            ).values_list(
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

        assigned_ids = set(
            NumberPool.objects.filter(
                id__in=value,
                status="ASSIGNED",
            ).values_list(
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

            raise serializers.ValidationError({
                "number_ids":
                "Some selected numbers are not assigned."
            })

        return value


# =========================================================
# AUTO ASSIGN SERIALIZER
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

    # CLIENT IS OPTIONAL
    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.filter(
            is_active=True
        ),
        required=False,
        allow_null=True,
        default=None,
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

    def validate(self, attrs):

        # Client is optional. If the frontend does not send it,
        # keep the value as None and continue allocation.
        if "client" not in attrs:
            attrs["client"] = None

        carrier = attrs["carrier"]

        termination = attrs.get(
            "termination"
        )

        payment_term = attrs.get(
            "payment_term"
        )

        if termination:

            if termination.carrier_id != carrier.id:

                raise serializers.ValidationError({
                    "termination":
                    "Selected termination does not "
                    "belong to selected carrier."
                })

            termination_payment_term = (
                termination.payment_term
            )

            if not payment_term:

                attrs["payment_term"] = (
                    termination_payment_term
                )

            elif payment_term != termination_payment_term:

                raise serializers.ValidationError({
                    "payment_term":
                    "Selected payment term does not "
                    "match the selected termination."
                })

        prefix = attrs.get(
            "prefix"
        )

        if prefix:

            attrs["prefix"] = prefix.strip()

        quantity = attrs.get(
            "quantity"
        )

        if quantity <= 0:

            raise serializers.ValidationError({
                "quantity":
                "Quantity must be greater than zero."
            })

        return attrs