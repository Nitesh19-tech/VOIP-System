from apps.routes.models import Route


class RouteSelector:

    @staticmethod
    def get_matching_routes(number, routing_plan):

        routes = (
            Route.objects.filter(
                is_active=True,
                routing_plan=routing_plan,
                termination__is_active=True,
                termination__carrier__is_active=True,
            )
            .select_related(
                "termination",
                "termination__carrier",
            )
        )

        matches = []

        for route in routes:

            if number.startswith(route.prefix):
                matches.append(route)

        matches.sort(

            key=lambda r: (

                -len(r.prefix),

                float(r.termination.carrier_payout),

                r.priority,

            )

        )

        return matches