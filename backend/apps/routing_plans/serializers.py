from rest_framework import serializers

from .models import RoutingPlan


class RoutingPlanSerializer(serializers.ModelSerializer):

    class Meta:

        model = RoutingPlan

        fields = "__all__"

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "created_by",
        )