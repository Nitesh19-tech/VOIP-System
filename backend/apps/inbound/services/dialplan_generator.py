from apps.inbound.models import InboundRoute
from apps.number_pool.models import NumberPool


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

            forward_number = (
                route.forward_number.strip()
            )

            termination = route.termination

            if not termination:
                continue

            carrier = termination.carrier

            if not carrier:
                continue

            # =================================================
            # NUMBER POOL VALIDATION
            # =================================================

            number = (
                NumberPool.objects
                .select_related(
                    "carrier",
                    "termination",
                )
                .filter(
                    did_number=did,
                )
                .first()
            )

            # DID must exist in Number Pool
            if not number:
                continue

            # DID must be assigned
            if number.status != "ASSIGNED":
                continue

            # DID must have carrier
            if not number.carrier:
                continue

            # DID must have termination
            if not number.termination:
                continue

            # Route termination must match NumberPool
            if (
                number.termination_id
                != termination.id
            ):
                continue

            # Route carrier must match NumberPool
            if (
                number.carrier_id
                != carrier.id
            ):
                continue

            # =================================================
            # BASIC VALIDATION
            # =================================================

            if not did or not forward_number:
                continue

            carrier_name = (
                carrier.name.strip()
            )

            termination_name = (
                termination.name.strip()
            )

            if not carrier_name:
                continue

            # =================================================
            # COMMENTS
            # =================================================

            lines.append(
                "; -----------------------------------------"
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
                "; -----------------------------------------"
            )

            # =================================================
            # DIALPLAN
            # =================================================

            lines.append(
                f"exten => {did},1,"
                f"NoOp(Inbound DID {did})"
            )

            lines.append(
                f" same => n,"
                f"NoOp(Forwarding to {forward_number})"
            )

            lines.append(
                f" same => n,"
                f"NoOp(Termination: {termination_name})"
            )

            lines.append(
                f" same => n,"
                f"NoOp(Carrier: {carrier_name})"
            )

            lines.append(
                f" same => n,"
                f"Dial(PJSIP/{forward_number}"
                f"@{carrier_name},60)"
            )

            lines.append(
                " same => n,Hangup()"
            )

            lines.append("")

        return "\n".join(lines)