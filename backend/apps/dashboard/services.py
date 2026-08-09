from django.db.models import Avg, Sum
from django.utils import timezone
from django.contrib.auth import get_user_model

from apps.accounts.constants import SUPER_ADMIN, COMPANY_ADMIN

from apps.companies.models import Company
from apps.clients.models import Client
from apps.sip.models import SIPAccount
from apps.cdr.models import CallRecord
from apps.asterisk.asterisk_service import AsteriskService


User = get_user_model()


class DashboardService:

    # =====================================================
    # OVERVIEW
    # =====================================================

    @staticmethod
    def overview(user):

        is_super_admin = user.role == SUPER_ADMIN
        is_company_admin = user.role == COMPANY_ADMIN

        # -------------------------------------------------
        # SUPER ADMIN
        # -------------------------------------------------

        if is_super_admin:

            clients = Client.objects.all()

            sip_accounts = SIPAccount.objects.all()

            cdr = CallRecord.objects.all()

            total_companies = Company.objects.count()

            total_clients = clients.count()

            total_admins = User.objects.filter(
                role=COMPANY_ADMIN
            ).count()

        # -------------------------------------------------
        # COMPANY ADMIN
        # -------------------------------------------------

        elif is_company_admin:

            clients = Client.objects.filter(
                admin=user
            )

            sip_accounts = SIPAccount.objects.filter(
                admin=user
            )

            cdr = CallRecord.objects.filter(
                caller__admin=user
            ) | CallRecord.objects.filter(
                receiver__admin=user
            )

            cdr = cdr.distinct()

            total_companies = 1

            total_clients = clients.count()

            total_admins = 1

        # -------------------------------------------------
        # UNKNOWN ROLE
        # -------------------------------------------------

        else:

            clients = Client.objects.none()

            sip_accounts = SIPAccount.objects.none()

            cdr = CallRecord.objects.none()

            total_companies = 0

            total_clients = 0

            total_admins = 0

        # =================================================
        # EXTENSIONS
        # =================================================

        endpoints = DashboardService.extensions(user)

        devices = DashboardService.devices(user)

        calls = DashboardService.active_calls(user)

        # =================================================
        # EXTENSION COUNTS
        # =================================================

        total_extensions = sip_accounts.count()

        online_extensions = sum(
            1
            for endpoint in endpoints
            if endpoint["status"] != "Unavailable"
        )

        offline_extensions = max(
            total_extensions - online_extensions,
            0
        )

        # =================================================
        # DEVICES
        # =================================================

        registered_devices = len(devices)

        # =================================================
        # ACTIVE CALLS
        # =================================================

        active_calls = len(calls) // 2

        # =================================================
        # DATE
        # =================================================

        today = timezone.localdate()

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "total_companies": total_companies,

            "total_clients": total_clients,

            "total_admins": total_admins,

            "total_extensions": total_extensions,

            "registered_devices": registered_devices,

            "online_extensions": online_extensions,

            "offline_extensions": offline_extensions,

            "active_calls": active_calls,

            "today_calls": cdr.filter(
                start_time__date=today
            ).count(),

            "answered_calls": cdr.filter(
                disposition="ANSWERED"
            ).count(),

            "busy_calls": cdr.filter(
                disposition="BUSY"
            ).count(),

            "failed_calls": cdr.filter(
                disposition="FAILED"
            ).count(),

            "no_answer_calls": cdr.filter(
                disposition="NO ANSWER"
            ).count(),

            "total_duration": cdr.aggregate(
                Sum("duration")
            )["duration__sum"] or 0,

            "average_duration": cdr.aggregate(
                Avg("duration")
            )["duration__avg"] or 0,
        }

    # =====================================================
    # EXTENSIONS
    # =====================================================

    @staticmethod
    def extensions(user):

        output = AsteriskService.get_endpoints()

        data = []

        # -------------------------------------------------
        # Allowed SIP usernames
        # -------------------------------------------------

        if user.role == SUPER_ADMIN:

            allowed_usernames = set(
                SIPAccount.objects.values_list(
                    "username",
                    flat=True
                )
            )

        elif user.role == COMPANY_ADMIN:

            allowed_usernames = set(
                SIPAccount.objects.filter(
                    admin=user
                ).values_list(
                    "username",
                    flat=True
                )
            )

        else:

            allowed_usernames = set()

        # =================================================
        # Parse Asterisk
        # =================================================

        for line in output.splitlines():

            line = line.strip()

            if (
                not line
                or not line.startswith("Endpoint:")
                or "<Endpoint/CID" in line
            ):
                continue

            try:

                endpoint = line.split()[1]

                extension = endpoint.split("/")[-1]

            except Exception:

                continue

            # -------------------------------------------------
            # Company Admin isolation
            # -------------------------------------------------

            if extension not in allowed_usernames:
                continue

            # -------------------------------------------------
            # Status
            # -------------------------------------------------

            if "Not in use" in line:

                status = "Not in use"

            elif "Unavailable" in line:

                status = "Unavailable"

            elif "In use" in line:

                status = "In use"

            elif "Busy" in line:

                status = "Busy"

            elif "Ringing" in line:

                status = "Ringing"

            else:

                status = "Unknown"

            # -------------------------------------------------
            # SIP
            # -------------------------------------------------

            sip = SIPAccount.objects.filter(
                username=extension
            ).first()

            data.append({

                "extension": extension,

                "caller_id": (
                    sip.caller_id
                    if sip
                    else ""
                ),

                "client": (
                    sip.client.name
                    if sip
                    else ""
                ),

                "status": status,

            })

        return data

    # =====================================================
    # DEVICES
    # =====================================================

    @staticmethod
    def devices(user):

        output = AsteriskService.get_contacts()

        data = []

        # -------------------------------------------------
        # Allowed SIP usernames
        # -------------------------------------------------

        if user.role == SUPER_ADMIN:

            allowed_usernames = set(
                SIPAccount.objects.values_list(
                    "username",
                    flat=True
                )
            )

        elif user.role == COMPANY_ADMIN:

            allowed_usernames = set(
                SIPAccount.objects.filter(
                    admin=user
                ).values_list(
                    "username",
                    flat=True
                )
            )

        else:

            allowed_usernames = set()

        # =================================================
        # Parse contacts
        # =================================================

        for line in output.splitlines():

            line = line.strip()

            if not line.startswith("Contact:"):
                continue

            try:

                contact = line.split()[1]

                extension = contact.split("/")[0]

                if extension not in allowed_usernames:
                    continue

                address = contact.split("@")[1]

                ip_port = address.split(";")[0]

                ip = ip_port.split(":")[0]

                port = ip_port.split(":")[1]

                sip = SIPAccount.objects.filter(
                    username=extension
                ).first()

                data.append({

                    "extension": extension,

                    "caller_id": (
                        sip.caller_id
                        if sip
                        else ""
                    ),

                    "client": (
                        sip.client.name
                        if sip
                        else ""
                    ),

                    "ip_address": ip,

                    "port": port,

                    "status": "Online",

                })

            except Exception:

                continue

        return data

    # =====================================================
    # ACTIVE CALLS
    # =====================================================

    @staticmethod
    def active_calls(user):

        output = AsteriskService.execute(
            'asterisk -rx "core show channels concise"'
        )

        data = []

        # -------------------------------------------------
        # Allowed SIP usernames
        # -------------------------------------------------

        if user.role == SUPER_ADMIN:

            allowed_usernames = set(
                SIPAccount.objects.values_list(
                    "username",
                    flat=True
                )
            )

        elif user.role == COMPANY_ADMIN:

            allowed_usernames = set(
                SIPAccount.objects.filter(
                    admin=user
                ).values_list(
                    "username",
                    flat=True
                )
            )

        else:

            allowed_usernames = set()

        # =================================================
        # Parse active channels
        # =================================================

        for line in output.splitlines():

            line = line.strip()

            if not line:
                continue

            parts = line.split("!")

            if len(parts) < 8:
                continue

            channel = parts[0]

            if not channel.startswith("PJSIP/"):
                continue

            try:

                extension = (
                    channel
                    .split("/")[1]
                    .split("-")[0]
                )

            except Exception:

                extension = ""

            # -------------------------------------------------
            # Company Admin isolation
            # -------------------------------------------------

            if extension not in allowed_usernames:
                continue

            state = parts[4]

            application = parts[5]

            connected_to = parts[7]

            linkedid = parts[-1]

            sip = SIPAccount.objects.filter(
                username=extension
            ).first()

            data.append({

                "channel": channel,

                "extension": extension,

                "caller_id": (
                    sip.caller_id
                    if sip
                    else ""
                ),

                "client": (
                    sip.client.name
                    if sip
                    else ""
                ),

                "connected_to": connected_to,

                "state": state,

                "application": application,

                "linkedid": linkedid,

            })

        return data