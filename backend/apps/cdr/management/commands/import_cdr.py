import time

from django.core.management.base import BaseCommand

from apps.cdr.services import CDRService


class Command(BaseCommand):

    help = (
        "Import Asterisk CDR CSV into Django database. "
        "Can run once or continuously."
    )

    def add_arguments(self, parser):

        parser.add_argument(
            "--watch",
            action="store_true",
            help="Continuously monitor and import new CDR records.",
        )

        parser.add_argument(
            "--interval",
            type=int,
            default=30,
            help="Seconds between CDR checks. Default: 30.",
        )

    # =====================================================
    # SINGLE IMPORT
    # =====================================================

    def run_import(self):

        start_time = time.time()

        self.stdout.write(
            self.style.WARNING(
                "\nStarting CDR import..."
            )
        )

        try:

            result = CDRService.import_csv()

        except Exception as e:

            self.stdout.write(
                self.style.ERROR(
                    "\n========== CDR Import ==========\n"
                    f"Import Error : {e}\n"
                    "================================\n"
                )
            )

            return None

        elapsed = time.time() - start_time

        imported = result.get(
            "imported",
            0,
        )

        skipped = result.get(
            "skipped",
            0,
        )

        failed = result.get(
            "failed",
            0,
        )

        if failed > 0:

            self.stdout.write(
                self.style.WARNING(
                    "\n========== CDR Import =========="
                )
            )

        else:

            self.stdout.write(
                self.style.SUCCESS(
                    "\n========== CDR Import =========="
                )
            )

        self.stdout.write(
            f"Imported : {imported}"
        )

        self.stdout.write(
            f"Skipped  : {skipped}"
        )

        self.stdout.write(
            f"Failed   : {failed}"
        )

        self.stdout.write(
            f"Time     : {elapsed:.2f}s"
        )

        self.stdout.write(
            "================================\n"
        )

        return result

    # =====================================================
    # COMMAND
    # =====================================================

    def handle(self, *args, **options):

        watch = options.get(
            "watch",
            False,
        )

        interval = options.get(
            "interval",
            30,
        )

        # -------------------------------------------------
        # Safety
        # -------------------------------------------------

        if interval < 5:

            interval = 5

        # -------------------------------------------------
        # ONE TIME IMPORT
        # -------------------------------------------------

        if not watch:

            self.run_import()

            return

        # -------------------------------------------------
        # CONTINUOUS IMPORT
        # -------------------------------------------------

        self.stdout.write(
            self.style.SUCCESS(
                "\n"
                "========================================\n"
                "       CDR AUTO IMPORT STARTED\n"
                "========================================\n"
                f"Check interval : {interval} seconds\n"
                "Source         : Asterisk Master.csv\n"
                "Destination    : Django CallRecord\n"
                "Mode           : Continuous\n"
                "========================================\n"
            )
        )

        try:

            while True:

                self.run_import()

                self.stdout.write(
                    self.style.NOTICE(
                        f"Next CDR check in {interval} seconds..."
                    )
                )

                time.sleep(interval)

        except KeyboardInterrupt:

            self.stdout.write(
                self.style.WARNING(
                    "\n\nCDR auto import stopped."
                )
            )