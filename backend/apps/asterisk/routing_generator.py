from apps.routes.models import Route


class RoutingGenerator:

    @staticmethod
    def generate(route):

        dial_string = "${EXTEN}"

        if route.strip_digits > 0:
            dial_string = "${EXTEN:%d}" % route.strip_digits

        if route.add_prefix:
            dial_string = f"{route.add_prefix}{dial_string}"

        return f"""
; ==================================================
; Routing Plan : {route.routing_plan.name}
; Prefix       : {route.prefix}
; Termination  : {route.termination.name}
; Carrier      : {route.termination.carrier.name}
; Priority     : {route.priority}
; ==================================================

exten => _{route.prefix}X.,1,NoOp(Route : {route.termination.name})
 same => n,Dial(PJSIP/{dial_string}@{route.termination.carrier.name},60)
 same => n,Hangup()

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
                "routing_plan",
                "priority",
                "prefix",
            )
        )

        for route in routes:

            dialplan += RoutingGenerator.generate(route)

        return dialplan