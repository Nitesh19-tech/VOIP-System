from apps.routes.models import Route
from apps.routing_engine.services import RoutingService


class RoutingGenerator:

    @staticmethod
    def generate(route):

        failover = RoutingService.build_failover(route)

        return f"""
; ==================================================
; Routing Plan : {route.routing_plan.name}
; Prefix       : {route.prefix}
; ==================================================

exten => _{route.prefix}X.,1,NoOp(Route Prefix : {route.prefix})

{failover}

"""

    @staticmethod
    def generate_all():

        dialplan = """
; ==================================================
; AUTO GENERATED ROUTING
; DO NOT EDIT MANUALLY
; ==================================================

[from-routing]

"""

        routes = (
            Route.objects.filter(is_active=True)
            .select_related(
                "routing_plan",
                "termination",
                "termination__carrier",
            )
            .order_by(
                "routing_plan__id",
                "-prefix",
                "priority",
            )
        )

        processed = set()

        for route in routes:

            key = (
                route.routing_plan_id,
                route.prefix,
            )

            if key in processed:
                continue

            processed.add(key)

            dialplan += RoutingGenerator.generate(route)

        return dialplan