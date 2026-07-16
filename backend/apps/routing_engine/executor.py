from .processor import OutboundCallProcessor


class CallExecutor:

    @staticmethod
    def execute(number, routing_plan):

        result = OutboundCallProcessor.process(
            number=number,
            routing_plan=routing_plan,
        )

        return {

            "status": "READY",

            "carrier": result["carrier"],

            "termination": result["termination"],

            "dial_number": result["dial_number"],

            "dial_string": result["dial_string"],

            "priority": result["priority"],

            "cost": result["cost"],

        }

    @staticmethod
    def execute_best(number, routing_plan):

        return CallExecutor.execute(
            number,
            routing_plan,
        )