from apps.routing_engine.processor import OutboundCallProcessor
from .asterisk_service import AsteriskService


class OriginateService:

    @staticmethod
    def build_command(extension, number, routing_plan):

        result = OutboundCallProcessor.process(
            number=number,
            routing_plan=routing_plan,
        )

        dial_string = result["dial_string"]

        return (
            f'channel originate '
            f'PJSIP/{extension} '
            f'extension {dial_string}'
        )

    @staticmethod
    def originate(extension, number, routing_plan):

        result = OutboundCallProcessor.process(
            number,
            routing_plan,
        )

        command = (
            f'asterisk -rx '
            f'"channel originate '
            f'PJSIP/{extension} '
            f'extension {result["dial_string"]}"'
        )

        return AsteriskService.execute(command)