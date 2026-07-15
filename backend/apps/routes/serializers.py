from rest_framework import serializers

from .models import Route


class RouteSerializer(serializers.ModelSerializer):

    routing_plan_name = serializers.CharField(
        source="routing_plan.name",
        read_only=True,
    )

    carrier_name = serializers.CharField(
        source="carrier.name",
        read_only=True,
    )

    class Meta:

        model = Route

        fields = (
            "id",
            "routing_plan",
            "routing_plan_name",
            "carrier",
            "carrier_name",
            "prefix",
            "strip_digits",
            "add_prefix",
            "priority",
            "description",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "created_by",
            "routing_plan_name",
            "carrier_name",
        )