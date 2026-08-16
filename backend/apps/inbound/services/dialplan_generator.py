from apps.inbound.models import InboundRoute


class InboundDialplanGenerator:

    CONTEXT = "from-carrier"

    @staticmethod
    def generate():

        lines = [
            "; =========================================",
            "; AUTO GENERATED - INBOUND ROUTES",
            "; DO NOT EDIT MANUALLY",
            "; =========================================",
            "",
            f"[{InboundDialplanGenerator.CONTEXT}]",
            "",
        ]

        routes = (
            InboundRoute.objects
            .filter(
                enabled=True,
                termination__is_active=True,
                termination__carrier__is_active=True,
            )
            .select_related(
                "termination",
                "termination__carrier",
            )
            .order_by(
                "priority",
                "did",
            )
        )

        for route in routes:

            did = route.did.strip()
            forward_number = route.forward_number.strip()

            termination = route.termination
            carrier = termination.carrier

            carrier_name = carrier.name.strip()
            termination_name = termination.name.strip()

            if not did or not forward_number:
                continue

            lines.append(
                f"; -----------------------------------------"
            )

            lines.append(
                f"; DID         : {did}"
            )

            lines.append(
                f"; Forward     : {forward_number}"
            )

            lines.append(
                f"; Termination : {termination_name}"
            )

            lines.append(
                f"; Carrier     : {carrier_name}"
            )

            lines.append(
                f"; -----------------------------------------"
            )

            lines.append(
                f"exten => {did},1,NoOp(Inbound DID {did})"
            )

            lines.append(
                f" same => n,NoOp(Forwarding to {forward_number})"
            )

            lines.append(
                f" same => n,NoOp(Termination: {termination_name})"
            )

            lines.append(
                f" same => n,NoOp(Carrier: {carrier_name})"
            )

            lines.append(
                f" same => n,Dial(PJSIP/{forward_number}@{carrier_name},60)"
            )

            lines.append(
                " same => n,Hangup()"
            )

            lines.append("")

        return "\n".join(lines)