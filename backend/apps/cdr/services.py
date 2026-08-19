import csv
import os
import tempfile
from datetime import datetime

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.asterisk.ssh import AsteriskSSH
from apps.sip.models import SIPAccount
from apps.billing.services import RateService
from apps.number_pool.models import NumberPool

from .models import CallRecord


class CDRService:

    # =====================================================
    # DATETIME PARSER
    # =====================================================

    @staticmethod
    def parse_datetime(value):

        if not value:
            return None

        dt = datetime.strptime(
            value,
            "%Y-%m-%d %H:%M:%S",
        )

        return timezone.make_aware(dt)

    # =====================================================
    # FIND NUMBER POOL
    # =====================================================

    @staticmethod
    def find_number_pool(
        caller_number,
        receiver_number,
        context,
    ):
        """
        Find NumberPool for incoming DID calls.

        Incoming architecture:

            Carrier
                ↓
            Asterisk
                ↓
            DID / Number
                ↓
            NumberPool
                ↓
            Carrier / Termination / Client
        """

        # -------------------------------------------------
        # Incoming contexts
        # -------------------------------------------------

        incoming_contexts = {
            "from-carrier",
            "from-carrier-inbound",
            "from-trunk",
            "from-provider",
        }

        if context not in incoming_contexts:
            return None

        # -------------------------------------------------
        # Incoming DID
        # -------------------------------------------------

        did = (
            receiver_number or ""
        ).strip()

        if not did:
            return None

        # -------------------------------------------------
        # Exact DID lookup
        # -------------------------------------------------

        number_pool = (
            NumberPool.objects
            .select_related(
                "carrier",
                "termination",
                "client",
                "country",
            )
            .filter(
                did_number=did,
                status="ASSIGNED",
            )
            .first()
        )

        return number_pool

    # =====================================================
    # IMPORT CDR CSV
    # =====================================================

    @staticmethod
    def import_csv():

        ssh = None
        temp_file = None

        imported = 0
        skipped = 0
        failed = 0

        try:

            # -------------------------------------------------
            # Temporary CSV
            # -------------------------------------------------

            fd, temp_file = tempfile.mkstemp(
                suffix=".csv"
            )

            os.close(fd)

            # -------------------------------------------------
            # Asterisk SSH
            # -------------------------------------------------

            ssh = AsteriskSSH(
                host=settings.ASTERISK_HOST,
                username=settings.ASTERISK_USERNAME,
                password=settings.ASTERISK_PASSWORD,
                port=settings.ASTERISK_PORT,
            )

            ssh.download_file(
                settings.ASTERISK_CDR_FILE,
                temp_file,
            )

            # -------------------------------------------------
            # Read CSV
            # -------------------------------------------------

            with open(
                temp_file,
                newline="",
                encoding="utf-8",
            ) as csvfile:

                reader = csv.reader(csvfile)

                for row in reader:

                    try:

                        # -------------------------------------------------
                        # Validate row
                        # -------------------------------------------------

                        if len(row) < 17:
                            continue

                        uniqueid = row[16]

                        if not uniqueid:
                            continue

                        # -------------------------------------------------
                        # Duplicate check
                        # -------------------------------------------------

                        if CallRecord.objects.filter(
                            uniqueid=uniqueid
                        ).exists():

                            skipped += 1
                            continue

                        # -------------------------------------------------
                        # Basic call data
                        # -------------------------------------------------

                        caller_number = (
                            row[1] or ""
                        ).strip()

                        receiver_number = (
                            row[2] or ""
                        ).strip()

                        context = (
                            row[3] or ""
                        ).strip()

                        # -------------------------------------------------
                        # SIP accounts
                        # -------------------------------------------------

                        caller = (
                            SIPAccount.objects
                            .filter(
                                username=caller_number
                            )
                            .first()
                        )

                        receiver = (
                            SIPAccount.objects
                            .filter(
                                username=receiver_number
                            )
                            .first()
                        )

                        caller_name = (
                            caller.caller_id
                            if caller
                            else caller_number
                        )

                        receiver_name = (
                            receiver.caller_id
                            if receiver
                            else receiver_number
                        )

                        # -------------------------------------------------
                        # Number Pool mapping
                        # -------------------------------------------------

                        number_pool = (
                            CDRService.find_number_pool(
                                caller_number=caller_number,
                                receiver_number=receiver_number,
                                context=context,
                            )
                        )

                        # -------------------------------------------------
                        # Create CDR
                        # -------------------------------------------------

                        with transaction.atomic():

                            cdr = CallRecord.objects.create(

                                # -----------------------------------------
                                # SIP
                                # -----------------------------------------

                                caller=caller,
                                receiver=receiver,

                                caller_number=caller_number,
                                receiver_number=receiver_number,

                                caller_name=caller_name,
                                receiver_name=receiver_name,

                                # -----------------------------------------
                                # Asterisk
                                # -----------------------------------------

                                context=context,

                                application=(
                                    row[7] or ""
                                ),

                                channel=(
                                    row[5] or ""
                                ),

                                destination_channel=(
                                    row[6] or ""
                                ),

                                # -----------------------------------------
                                # Timing
                                # -----------------------------------------

                                start_time=(
                                    CDRService.parse_datetime(
                                        row[9]
                                    )
                                ),

                                answer_time=(
                                    CDRService.parse_datetime(
                                        row[10]
                                    )
                                ),

                                end_time=(
                                    CDRService.parse_datetime(
                                        row[11]
                                    )
                                ),

                                duration=int(
                                    row[12] or 0
                                ),

                                billsec=int(
                                    row[13] or 0
                                ),

                                disposition=(
                                    row[14] or "ANSWERED"
                                ),

                                uniqueid=uniqueid,

                                # -----------------------------------------
                                # Number Pool
                                # -----------------------------------------

                                number_pool=number_pool,
                            )

                            # ---------------------------------------------
                            # Automatic Rating
                            # ---------------------------------------------

                            RateService.rate_call(
                                cdr
                            )

                        imported += 1

                    except Exception as e:

                        failed += 1

                        print(
                            f"CDR Import Error: {e}"
                        )

        finally:

            # -------------------------------------------------
            # Close SSH
            # -------------------------------------------------

            if ssh:
                ssh.close()

            # -------------------------------------------------
            # Remove temporary file
            # -------------------------------------------------

            if (
                temp_file
                and os.path.exists(temp_file)
            ):
                os.remove(temp_file)

        return {
            "imported": imported,
            "skipped": skipped,
            "failed": failed,
        }