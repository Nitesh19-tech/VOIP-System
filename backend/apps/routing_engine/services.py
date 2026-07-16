from apps.routes.models import Route


class RoutingService:

    @staticmethod
    def _dial_number(route):

        dial_number = "${EXTEN}"

        if route.strip_digits > 0:
            dial_number = f"${{EXTEN:{route.strip_digits}}}"

        if route.add_prefix:
            dial_number = f"{route.add_prefix}{dial_number}"

        return dial_number

    @staticmethod
    def build_dial(route):

        dial_number = RoutingService._dial_number(route)

        return (
            f"Dial(PJSIP/{dial_number}@"
            f"{route.termination.carrier.name},60)"
        )

    @staticmethod
    def build_failover(route):

        routes = (
            Route.objects.filter(
                is_active=True,
                routing_plan=route.routing_plan,
                prefix=route.prefix,
                termination__is_active=True,
                termination__carrier__is_active=True,
            )
            .select_related(
                "termination",
                "termination__carrier",
            )
            .order_by("priority")
        )

        lines = []

        total = routes.count()

        for index, item in enumerate(routes):

            dial_number = RoutingService._dial_number(item)

            carrier = item.termination.carrier.name

            lines.append(
                f" same => n,NoOp(Trying Carrier : {carrier})"
            )

            lines.append(
                f" same => n,Dial(PJSIP/{dial_number}@{carrier},30)"
            )

            if index < total - 1:

                lines.append(
                    ' same => n,GotoIf($['
                    '"${DIALSTATUS}"="CHANUNAVAIL" | '
                    '"${DIALSTATUS}"="CONGESTION" | '
                    '"${DIALSTATUS}"="BUSY"'
                    f']?carrier_{index + 2})'
                )

                lines.append(
                    " same => n,Hangup()"
                )

                lines.append(
                    f" same => n(carrier_{index + 2}),NoOp(Failover)"
                )

        lines.append(
            " same => n,Hangup()"
        )

        return "\n".join(lines)