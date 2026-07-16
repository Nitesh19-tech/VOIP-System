from apps.carriers.models import Carrier


class CarrierGenerator:

    @staticmethod
    def generate(carrier):

        ips = carrier.ips.filter(is_active=True)

        if not ips.exists():
            return ""

        first_ip = ips.first()

        config = f"""
; ==================================================
; Carrier : {carrier.name}
; ==================================================

[{carrier.name}]
type=endpoint
transport=transport-udp
context=from-carrier

disallow=all
allow=ulaw,alaw

aors={carrier.name}

direct_media=no
rtp_symmetric=yes
rewrite_contact=yes
force_rport=yes

identify_by=ip


[{carrier.name}]
type=aor

contact=sip:{first_ip.ip_address}:5060
qualify_frequency=60


"""

        for index, ip in enumerate(ips, start=1):

            config += f"""
[{carrier.name}-identify-{index}]
type=identify

endpoint={carrier.name}

match={ip.ip_address}

"""

        return config

    @staticmethod
    def generate_all():

        config = """
; ==================================================
; AUTO GENERATED CARRIER FILE
; DO NOT EDIT MANUALLY
; ==================================================

"""

        carriers = (
            Carrier.objects
            .filter(is_active=True)
            .prefetch_related("ips")
            .order_by("name")
        )

        for carrier in carriers:
            config += CarrierGenerator.generate(carrier)

        return config