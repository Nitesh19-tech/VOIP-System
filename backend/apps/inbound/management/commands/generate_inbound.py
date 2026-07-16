from django.core.management.base import BaseCommand

from apps.inbound.services.file_writer import InboundFileWriter


class Command(BaseCommand):

    help = "Generate inbound dialplan"

    def handle(self, *args, **kwargs):

        file = InboundFileWriter().write()

        self.stdout.write(self.style.SUCCESS(str(file)))