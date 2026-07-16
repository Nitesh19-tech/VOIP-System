from .actions import AMIActions
from .services import AMIService

from apps.routing_engine.processor import OutboundCallProcessor


class OriginateService:

    @staticmethod
    def originate(
        extension,
        number,
        routing_plan,
        callerid=None,
    ):

        # ---------------------------------------
        # Resolve Route
        # ---------------------------------------

        result = OutboundCallProcessor.process(
            number=number,
            routing_plan=routing_plan,
        )

        # ---------------------------------------
        # Build AMI Originate Action
        # ---------------------------------------

        action = AMIActions.originate(

            channel=f"PJSIP/{extension}",

            context="from-routing",

            extension=result["dial_number"],

            priority=1,

            callerid=callerid,

        )

        # ---------------------------------------
        # Send to AMI
        # ---------------------------------------

        with AMIService() as ami:

            response = ami.execute(action)

        return {

            "success": "Success" in response,

            "response": response,

            "carrier": result["carrier"],

            "termination": result["termination"],

            "dial_number": result["dial_number"],

            "dial_string": result["dial_string"],

            "priority": result["priority"],

            "cost": result["cost"],

        }