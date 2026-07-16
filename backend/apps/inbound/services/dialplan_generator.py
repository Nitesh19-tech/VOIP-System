from apps.inbound.models import InboundRoute


class InboundDialplanGenerator:

    CONTEXT = "company-inbound"

    def generate(self):

        lines = [
            "; =========================================",
            "; AUTO GENERATED - DO NOT EDIT",
            "; =========================================",
            "",
            f"[{self.CONTEXT}]",
            "",
        ]

        routes = (
            InboundRoute.objects
            .filter(enabled=True)
            .order_by("priority")
        )

        for route in routes:

            did = route.did

            action = route.destination_type

            destination = route.destination

            lines.append(
                f"exten => {did},1,NoOp(Inbound DID {did})"
            )

            if action == "extension":

                lines.append(
                    f" same => n,Dial(PJSIP/{destination},30)"
                )

            elif action == "queue":

                lines.append(
                    f" same => n,Queue({destination})"
                )

            elif action == "ivr":

                lines.append(
                    f" same => n,Goto({destination},s,1)"
                )

            elif action == "ringgroup":

                lines.append(
                    f" same => n,Dial({destination},30)"
                )

            lines.append(" same => n,Hangup()")
            lines.append("")

        return "\n".join(lines)