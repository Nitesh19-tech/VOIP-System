from django.db.models import Q
from django.utils import timezone

from .models import LiveCall


class CallService:

    @staticmethod
    def create_call(event):

        uniqueid = (event.get("Uniqueid") or "").strip()

        if not uniqueid:
            return None

        linkedid = (event.get("Linkedid") or uniqueid).strip()
        caller = (event.get("CallerIDNum") or "").strip()
        channel = (event.get("Channel") or "").strip()

        call, created = LiveCall.objects.get_or_create(
            uniqueid=uniqueid,
            defaults={
                "linkedid": linkedid,
                "caller": caller,
                "receiver": "",
                "caller_channel": channel,
                "receiver_channel": "",
                "status": "RINGING",
            },
        )

        if not created:

            changed_fields = []

            if linkedid and not call.linkedid:
                call.linkedid = linkedid
                changed_fields.append("linkedid")

            if caller and not call.caller:
                call.caller = caller
                changed_fields.append("caller")

            if channel and not call.caller_channel:
                call.caller_channel = channel
                changed_fields.append("caller_channel")

            if changed_fields:
                call.save(
                    update_fields=changed_fields
                )

        return call

    @staticmethod
    def _find_call(event):

        uniqueid = (event.get("Uniqueid") or "").strip()
        linkedid = (event.get("Linkedid") or "").strip()
        channel = (event.get("Channel") or "").strip()
        dest_channel = (event.get("DestChannel") or "").strip()

        # 1. First try Uniqueid
        if uniqueid:

            call = LiveCall.objects.filter(
                uniqueid=uniqueid
            ).first()

            if call:
                return call

        # 2. Then try Linkedid
        if linkedid:

            call = LiveCall.objects.filter(
                linkedid=linkedid
            ).order_by("-started_at").first()

            if call:
                return call

        # 3. Finally try channel
        if channel or dest_channel:

            query = Q()

            if channel:
                query |= (
                    Q(caller_channel=channel)
                    | Q(receiver_channel=channel)
                )

            if dest_channel:
                query |= (
                    Q(caller_channel=dest_channel)
                    | Q(receiver_channel=dest_channel)
                )

            call = (
                LiveCall.objects
                .filter(query)
                .order_by("-started_at")
                .first()
            )

            if call:
                return call

        return None

    @staticmethod
    def update_receiver(event):

        call = CallService._find_call(event)

        # Agar call abhi DB mein nahi hai,
        # to pehle create karo
        if not call:

            uniqueid = (
                event.get("Uniqueid") or ""
            ).strip()

            if uniqueid:

                CallService.create_call(event)
                call = CallService._find_call(event)

        if not call:
            return None

        receiver = (
            event.get("DestCallerIDNum") or ""
        ).strip()

        receiver_channel = (
            event.get("DestChannel") or ""
        ).strip()

        changed_fields = []

        if receiver:

            call.receiver = receiver
            changed_fields.append("receiver")

        if receiver_channel:

            call.receiver_channel = receiver_channel
            changed_fields.append("receiver_channel")

        if call.status not in {
            "ANSWERED",
            "HANGUP",
        }:

            call.status = "DIALING"
            changed_fields.append("status")

        if changed_fields:

            call.save(
                update_fields=list(
                    dict.fromkeys(changed_fields)
                )
            )

        return call

    @staticmethod
    def answer_call(event):

        call = CallService._find_call(event)

        if not call:
            return None

        # HANGUP ho chuki call ko dobara ANSWERED mat karo
        if call.status == "HANGUP":
            return None

        if call.status != "ANSWERED":

            call.status = "ANSWERED"
            call.answered_at = timezone.now()

            call.save(
                update_fields=[
                    "status",
                    "answered_at",
                ]
            )

        return call

    @staticmethod
    def hangup_call(event):

        call = CallService._find_call(event)

        if not call:
            return None

        # Already hangup hai to dobara update mat karo
        if call.status == "HANGUP":
            return call

        call.status = "HANGUP"
        call.ended_at = timezone.now()

        call.save(
            update_fields=[
                "status",
                "ended_at",
            ]
        )

        return call