from apps.carriers.models import Carrier


class CarrierGenerator:

    @staticmethod
    def generate(carrier):

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
rewrite_contact=yes
force_rport=yes
rtp_symmetric=yes

"""

        ips = carrier.ips.filter(is_active=True)

        first_ip = ips.first()

        if first_ip:

            config += f"""
[{carrier.name}]
type=aor
contact=sip:{first_ip.ip_address}:5060

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
            Carrier.objects.filter(is_active=True)
            .prefetch_related("ips")
            .order_by("name")
        )

        for carrier in carriers:
            config += CarrierGenerator.generate(carrier)

        return config