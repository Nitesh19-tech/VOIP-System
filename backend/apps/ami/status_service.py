from .models import ExtensionStatus


class StatusService:

    @staticmethod
    def update_peer(event):

        extension = event.get("Peer")

        if not extension:
            return

        status = event.get(
            "PeerStatus",
            "UNKNOWN",
        ).upper()

        if "REGISTERED" in status:
            status = "ONLINE"

        elif "UNREGISTERED" in status:
            status = "OFFLINE"

        elif "LAGGED" in status:
            status = "UNAVAILABLE"

        ExtensionStatus.objects.update_or_create(

            extension=extension,

            defaults={
                "status": status,
            },
        )

    @staticmethod
    def update_contact(event):

        extension = event.get("EndpointName")

        if not extension:
            return

        contact_uri = event.get(
            "ContactURI",
            "",
        )

        ip = None
        port = None

        try:

            if "@" in contact_uri:

                address = contact_uri.split("@")[1]

                address = address.split(";")[0]

                ip, port = address.split(":")

        except Exception:
            pass

        ExtensionStatus.objects.update_or_create(

            extension=extension,

            defaults={

                "ip_address": ip,

                "port": int(port) if port else None,

                "status": "ONLINE",
            },
        )