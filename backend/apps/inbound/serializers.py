from rest_framework import serializers

from .models import InboundRoute


class InboundRouteSerializer(serializers.ModelSerializer):

    class Meta:

        model = InboundRoute

        fields = "__all__"