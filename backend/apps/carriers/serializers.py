from rest_framework import serializers

from .models import Carrier, CarrierIP


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