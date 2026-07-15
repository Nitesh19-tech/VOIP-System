from rest_framework import serializers

from .models import Carrier, CarrierIP, Termination


class CarrierIPSerializer(serializers.ModelSerializer):

    class Meta:
        model = CarrierIP
        fields = (
            "id",
            "carrier",
            "ip_address",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class CarrierSerializer(serializers.ModelSerializer):

    ips = CarrierIPSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Carrier
        fields = (
            "id",
            "name",
            "description",
            "is_active",
            "created_at",
            "updated_at",
            "ips",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

class TerminationSerializer(serializers.ModelSerializer):

    carrier_name = serializers.CharField(
        source="carrier.name",
        read_only=True,
    )

    class Meta:
        model = Termination
        fields = (
            "id",
            "carrier",
            "carrier_name",
            "name",
            "prefix",
            "currency",
            "payment_term",
            "carrier_payout",
            "daily_payout",
            "weekly_payout",
            "weekly7_payout",
            "monthly30_payout",
            "monthly45_payout",
            "monthly60_payout",
            "max_duration",
            "info",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "carrier_name",
            "created_at",
            "updated_at",
        )