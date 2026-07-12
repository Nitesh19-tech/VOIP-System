from django.core.management.base import BaseCommand

from apps.cdr.services import CDRService


class Command(BaseCommand):

    help = "Import Asterisk CDR CSV"

    def handle(self, *args, **options):

        result = CDRService.import_csv()

        self.stdout.write(
            self.style.SUCCESS(
                "\n"
                "========== CDR Import ==========\n"
                f"Imported : {result['imported']}\n"
                f"Skipped  : {result['skipped']}\n"
                f"Failed   : {result['failed']}\n"
                "===============================\n"
            )
        )