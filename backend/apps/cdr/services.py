import csv
import os
import tempfile
from datetime import datetime

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.asterisk.ssh import AsteriskSSH
from apps.sip.models import SIPAccount
from apps.billing.services import RatingService

from .models import CallRecord


class CDRService:

    @staticmethod
    def parse_datetime(value):
        if not value:
            return None

        dt = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        return timezone.make_aware(dt)

    @staticmethod
    def import_csv():
        ssh = None
        temp_file = None

        imported = 0
        skipped = 0
        failed = 0

        try:
            fd, temp_file = tempfile.mkstemp(suffix=".csv")
            os.close(fd)

            ssh = AsteriskSSH(
                host=settings.ASTERISK_HOST,
                username=settings.ASTERISK_USERNAME,
                password=settings.ASTERISK_PASSWORD,
                port=settings.ASTERISK_PORT,
            )

            ssh.download_file(settings.ASTERISK_CDR_FILE, temp_file)

            with open(temp_file, newline="", encoding="utf-8") as csvfile:
                reader = csv.reader(csvfile)

                for row in reader:
                    try:
                        if len(row) < 17:
                            continue

                        uniqueid = row[16]

                        if CallRecord.objects.filter(uniqueid=uniqueid).exists():
                            skipped += 1
                            continue

                        caller_number = row[1]
                        receiver_number = row[2]

                        caller = SIPAccount.objects.filter(username=caller_number).first()
                        receiver = SIPAccount.objects.filter(username=receiver_number).first()

                        caller_name = caller.caller_id if caller else caller_number
                        receiver_name = receiver.caller_id if receiver else receiver_number

                        with transaction.atomic():
                            cdr = CallRecord.objects.create(
                                caller=caller,
                                receiver=receiver,
                                caller_number=caller_number,
                                receiver_number=receiver_number,
                                caller_name=caller_name,
                                receiver_name=receiver_name,
                                context=row[3],
                                application=row[7],
                                channel=row[5],
                                destination_channel=row[6],
                                start_time=CDRService.parse_datetime(row[9]),
                                answer_time=CDRService.parse_datetime(row[10]),
                                end_time=CDRService.parse_datetime(row[11]),
                                duration=int(row[12]),
                                billsec=int(row[13]),
                                disposition=row[14],
                                uniqueid=uniqueid,
                            )

                            # =====================================
                            # Automatic Call Rating
                            # =====================================
                            RatingService.rate_call(cdr)

                        imported += 1

                    except Exception as e:
                        failed += 1
                        print(f"CDR Import Error: {e}")

        finally:
            if ssh:
                ssh.close()

            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)

        return {
            "imported": imported,
            "skipped": skipped,
            "failed": failed,
        }
