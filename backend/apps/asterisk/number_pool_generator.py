from apps.number_pool.models import NumberPool


class NumberPoolGenerator:

    CONTEXT = "from-carrier"

    # =====================================================
    # GENERATE SINGLE NUMBER MAPPING
    # =====================================================

    @staticmethod
    def generate(number):

        if not number:
            return ""

        # -------------------------------------------------
        # ONLY ASSIGNED NUMBERS
        # -------------------------------------------------

        if number.status != "ASSIGNED":
            return ""

        # -------------------------------------------------
        # DID
        # -------------------------------------------------

        did = (
            number.did_number or ""
        ).strip()

        if not did:
            return ""

        # -------------------------------------------------
        # CARRIER
        # -------------------------------------------------

        carrier = number.carrier

        if not carrier:
            return ""

        if not carrier.is_active:
            return ""

        # -------------------------------------------------
        # TERMINATION
        # -------------------------------------------------

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
            carrier.ips
            .filter(
                is_active=True
            )
            .order_by("id")
        )

        if not ips:
            return ""

        # -------------------------------------------------
        # GENERATE MAPPING INFORMATION
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

        return "\n".join(lines)

    # =====================================================
    # GENERATE SINGLE INBOUND DID DIALPLAN
    # =====================================================

    @staticmethod
    def generate_dialplan(number):

        if not number:
            return ""

        # -------------------------------------------------
        # ONLY ASSIGNED NUMBERS
        # -------------------------------------------------

        if number.status != "ASSIGNED":
            return ""

        # -------------------------------------------------
        # DID
        # -------------------------------------------------

        did = (
            number.did_number or ""
        ).strip()

        if not did:
            return ""

        # -------------------------------------------------
        # CARRIER
        # -------------------------------------------------

        carrier = number.carrier

        if not carrier:
            return ""

        if not carrier.is_active:
            return ""

        # -------------------------------------------------
        # TERMINATION
        # -------------------------------------------------

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
            carrier.ips
            .filter(
                is_active=True
            )
            .order_by("id")
        )

        if not ips:
            return ""

        # -------------------------------------------------
        # ACTUAL INBOUND DIALPLAN
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
            "; =================================================="
        )

        # -------------------------------------------------
        # INCOMING DID
        # -------------------------------------------------

        lines.append(
            f"exten => {did},1,NoOp(Incoming DID {did})"
        )

        lines.append(
            f" same => n,NoOp(Client: {client_name})"
        )

        lines.append(
            f" same => n,NoOp(Carrier: {carrier.name})"
        )

        lines.append(
            f" same => n,NoOp(Termination: {termination.name})"
        )

        # -------------------------------------------------
        # PRESERVE / LOG CALLER ID
        # -------------------------------------------------

        lines.append(
            ' same => n,NoOp(Incoming CLI: ${CALLERID(all)})'
        )

        lines.append(
            ' same => n,NoOp(Incoming Number: ${EXTEN})'
        )

        # -------------------------------------------------
        # RECEIVE IN ASTERISK
        # -------------------------------------------------

        lines.append(
            " same => n,Answer()"
        )

        lines.append(
            " same => n,Wait(60)"
        )

        lines.append(
            " same => n,Hangup()"
        )

        lines.append("")

        return "\n".join(lines)

    # =====================================================
    # GENERATE ALL MAPPINGS
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

    # =====================================================
    # GENERATE ALL INBOUND DIALPLAN
    # =====================================================

    @staticmethod
    def generate_all_dialplan():

        config = [

            "; ==================================================",
            "; AUTO GENERATED INBOUND DID DIALPLAN",
            "; DO NOT EDIT MANUALLY",
            "; ==================================================",
            "",
            f"[{NumberPoolGenerator.CONTEXT}]",
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
                NumberPoolGenerator.generate_dialplan(
                    number
                )
            )

            if generated:

                config.append(
                    generated
                )

        return "\n".join(config)