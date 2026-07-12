from django.utils import timezone

from .models import LiveCall


class CallService:

    @staticmethod
    def create_call(event):

        uniqueid = event.get("Uniqueid")

        if not uniqueid:
            return

        call, created = LiveCall.objects.get_or_create(
            uniqueid=uniqueid,
            defaults={
                "linkedid": event.get("Linkedid", ""),
                "caller": event.get("CallerIDNum", ""),
                "receiver": "",
                "caller_channel": event.get("Channel", ""),
                "receiver_channel": "",
                "status": "RINGING",
            },
        )

        if not created:

            call.caller = event.get(
                "CallerIDNum",
                call.caller,
            )

            call.caller_channel = event.get(
                "Channel",
                call.caller_channel,
            )

            call.save(
                update_fields=[
                    "caller",
                    "caller_channel",
                ]
            )

    @staticmethod
    def update_receiver(event):

        uniqueid = event.get("Uniqueid")

        if not uniqueid:
            return

        try:

            call = LiveCall.objects.get(
                uniqueid=uniqueid
            )

        except LiveCall.DoesNotExist:
            return

        call.receiver = event.get(
            "DestCallerIDNum",
            call.receiver,
        )

        call.receiver_channel = event.get(
            "DestChannel",
            call.receiver_channel,
        )

        call.status = "DIALING"

        call.save(
            update_fields=[
                "receiver",
                "receiver_channel",
                "status",
            ]
        )

    @staticmethod
    def answer_call(event):

        uniqueid = event.get("Uniqueid")

        if not uniqueid:
            return

        try:

            call = LiveCall.objects.get(
                uniqueid=uniqueid
            )

        except LiveCall.DoesNotExist:
            return

        if call.status != "ANSWERED":

            call.status = "ANSWERED"

            call.answered_at = timezone.now()

            call.save(
                update_fields=[
                    "status",
                    "answered_at",
                ]
            )

    @staticmethod
    def hangup_call(event):

        uniqueid = event.get("Uniqueid")

        if not uniqueid:
            return

        try:

            call = LiveCall.objects.get(
                uniqueid=uniqueid
            )

        except LiveCall.DoesNotExist:
            return

        call.status = "HANGUP"

        call.ended_at = timezone.now()

        call.save(
            update_fields=[
                "status",
                "ended_at",
            ]
        )