from .call_service import CallService
from .status_service import StatusService


class AMIHandler:

    @staticmethod
    def handle(event):

        event_type = event.get("Event")

        if not event_type:
            return

        print(f"AMI Event: {event_type}")

        if event_type == "Newchannel":

            CallService.create_call(event)

        elif event_type == "DialBegin":

            CallService.update_receiver(event)

        elif event_type == "BridgeEnter":

            CallService.answer_call(event)

        elif event_type == "Hangup":

            CallService.hangup_call(event)

        elif event_type == "PeerStatus":

            StatusService.update_peer(event)

        elif event_type == "ContactStatus":

            StatusService.update_contact(event)