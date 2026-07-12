from django.core.management.base import BaseCommand

from apps.ami.listener import AMIListener


class Command(BaseCommand):

    help = "Listen Asterisk AMI Events"

    def handle(self, *args, **options):

        self.stdout.write(
            self.style.SUCCESS(
                "AMI Listener Started..."
            )
        )

        AMIListener.start()