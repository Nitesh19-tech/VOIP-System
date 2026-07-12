from rest_framework import serializers

from .models import (
    Wallet,
    Transaction,
    Rate,
)


class RateSerializer(serializers.ModelSerializer):

    country_name = serializers.CharField(
        source="country.name",
        read_only=True,
    )

    class Meta:

        model = Rate

        fields = "__all__"

        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "country_name",
        )

    def validate(self, attrs):

        buy_rate = attrs.get(
            "buy_rate",
            getattr(
                self.instance,
                "buy_rate",
                None,
            ),
        )

        sell_rate = attrs.get(
            "sell_rate",
            getattr(
                self.instance,
                "sell_rate",
                None,
            ),
        )

        if sell_rate < buy_rate:

            raise serializers.ValidationError(

                {
                    "sell_rate":
                    "Sell Rate must be greater than or equal to Buy Rate."
                }

            )

        return attrs

    def validate_prefix(self, value):

        queryset = Rate.objects.filter(
            prefix=value,
            provider=self.initial_data.get(
                "provider",
                "",
            ),
            effective_date=self.initial_data.get(
                "effective_date",
            ),
        )

        if self.instance:

            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(

                "Rate already exists for this Prefix, Provider and Effective Date."

            )

        return value

    def validate_billing_block(
        self,
        value,
    ):

        if value not in (
            1,
            6,
            30,
            60,
        ):

            raise serializers.ValidationError(

                "Invalid Billing Block."

            )

        return value

    def validate_minimum_duration(
        self,
        value,
    ):

        if value < 0:

            raise serializers.ValidationError(

                "Minimum Duration cannot be negative."

            )

        return value

    def validate_connection_charge(
        self,
        value,
    ):

        if value < 0:

            raise serializers.ValidationError(

                "Connection Charge cannot be negative."

            )

        return value