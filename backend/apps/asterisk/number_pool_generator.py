from apps.number_pool.models import NumberPool


class NumberPoolGenerator:

    # =====================================================
    # GENERATE SINGLE NUMBER MAPPING
    # =====================================================

    @staticmethod
    def generate(number):

        if not number:
            return ""

        # -------------------------------------------------
        # NUMBER STATUS
        # -------------------------------------------------

        if number.status != "ASSIGNED":
            return ""

        # -------------------------------------------------
        # REQUIRED DATA
        # -------------------------------------------------

        did = (
            number.did_number or ""
        ).strip()

        if not did:
            return ""

        carrier = number.carrier

        if not carrier:
            return ""

        if not carrier.is_active:
            return ""

        termination = number.termination

        if not termination:
            return ""

        if not termination.is_active:
            return ""

        # -------------------------------------------------
        # CLIENT
        # -------------------------------------------------

        client_name = (
            number.client.name
            if number.client
            else "N/A"
        )

        # -------------------------------------------------
        # CARRIER IPS
        # -------------------------------------------------

        ips = list(
            carrier.ips.filter(
                is_active=True
            ).order_by("id")
        )

        if not ips:
            return ""

        # -------------------------------------------------
        # GENERATE MAPPING
        # -------------------------------------------------

        lines = []

        lines.append(
            "; =================================================="
        )

        lines.append(
            f"; DID         : {did}"
        )

        lines.append(
            f"; Client      : {client_name}"
        )

        lines.append(
            f"; Carrier     : {carrier.name}"
        )

        lines.append(
            f"; Termination : {termination.name}"
        )

        lines.append(
            "; Carrier IPs :"
        )

        for ip in ips:

            lines.append(
                f";   - {ip.ip_address}"
            )

        lines.append(
            "; =================================================="
        )

        lines.append("")

        # -------------------------------------------------
        # DID MAPPING
        # -------------------------------------------------

        lines.append(
            f"; DID {did} -> Carrier {carrier.name}"
        )

        lines.append(
            f"; DID {did} -> Termination {termination.name}"
        )

        for ip in ips:

            lines.append(
                f"; DID {did} -> Carrier IP {ip.ip_address}"
            )

        lines.append("")

        return "\n".join(lines)

    # =====================================================
    # GENERATE ALL
    # =====================================================

    @staticmethod
    def generate_all():

        config = [
            "; ==================================================",
            "; AUTO GENERATED NUMBER POOL MAPPING",
            "; DO NOT EDIT MANUALLY",
            "; ==================================================",
            "",
        ]

        numbers = (
            NumberPool.objects
            .filter(
                status="ASSIGNED",
                carrier__is_active=True,
                termination__is_active=True,
            )
            .select_related(
                "client",
                "carrier",
                "termination",
            )
            .prefetch_related(
                "carrier__ips",
            )
            .order_by(
                "did_number"
            )
        )

        for number in numbers:

            generated = (
                NumberPoolGenerator.generate(
                    number
                )
            )

            if generated:

                config.append(
                    generated
                )

        return "\n".join(config)