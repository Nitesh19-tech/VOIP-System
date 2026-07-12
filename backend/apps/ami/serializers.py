from rest_framework import serializers

from .models import LiveCall


class LiveCallSerializer(serializers.ModelSerializer):

    class Meta:

        model = LiveCall

        fields = [
            "id",
            "uniqueid",
            "linkedid",
            "caller",
            "receiver",
            "caller_channel",
            "receiver_channel",
            "status",
            "started_at",
            "answered_at",
            "ended_at",
        ]