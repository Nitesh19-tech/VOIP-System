from rest_framework import serializers

from .models import Route


class RouteSerializer(serializers.ModelSerializer):

    routing_plan_name = serializers.CharField(
        source="routing_plan.name",
        read_only=True,
    )

    termination_name = serializers.CharField(
        source="termination.name",
        read_only=True,
    )

    carrier_name = serializers.CharField(
        source="termination.carrier.name",
        read_only=True,
    )

    class Meta:

        model = Route

        fields = (
            "id",
            "routing_plan",
            "routing_plan_name",
            "termination",
            "termination_name",
            "carrier_name",
            "prefix",
            "strip_digits",
            "add_prefix",
            "priority",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "routing_plan_name",
            "termination_name",
            "carrier_name",
            "created_at",
            "updated_at",
        )