from rest_framework import serializers

from .models import Trunk


class TrunkSerializer(serializers.ModelSerializer):

    class Meta:

        model = Trunk

        fields = "__all__"

        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
        )