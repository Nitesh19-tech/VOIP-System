from rest_framework import serializers

from .models import Country, NumberPool


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


class NumberPoolSerializer(serializers.ModelSerializer):

    admin_name = serializers.CharField(
        source="admin.full_name",
        read_only=True,
    )

    client_name = serializers.CharField(
        source="client.name",
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

            "admin",
            "admin_name",

            "client",
            "client_name",

            "country",
            "country_name",
            "dial_code",

            "did_number",
            "extension",

            "provider",

            "purchase_price",
            "monthly_rental",

            "status",
            "assigned_at",

            "description",

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

            "country": {
                "required": True,
            },

            "provider": {
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

    def validate_extension(self, value):

        queryset = NumberPool.objects.filter(
            extension=value
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "This extension already exists."
            )

        return value