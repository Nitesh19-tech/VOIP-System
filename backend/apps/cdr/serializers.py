from rest_framework import serializers

from .models import CallRecord


class CallRecordSerializer(serializers.ModelSerializer):

    caller_extension = serializers.SerializerMethodField()
    receiver_extension = serializers.SerializerMethodField()

    class Meta:
        model = CallRecord
        fields = [
            "id",

            "caller",
            "receiver",

            "caller_extension",
            "receiver_extension",

            "caller_number",
            "receiver_number",

            "caller_name",
            "receiver_name",

            "context",
            "application",

            "channel",
            "destination_channel",

            "duration",
            "billsec",

            "disposition",

            "start_time",
            "answer_time",
            "end_time",

            "created_at",
        ]

    def get_caller_extension(self, obj):

        if obj.caller:
            return obj.caller.username

        return None

    def get_receiver_extension(self, obj):

        if obj.receiver:
            return obj.receiver.username

        return None