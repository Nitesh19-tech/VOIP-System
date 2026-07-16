from .exceptions import RouteNotFound


class RouteValidator:

    @staticmethod
    def validate(number, routing_plan):

        if not number:
            raise ValueError(
                "Destination number is required."
            )

        if not routing_plan:
            raise ValueError(
                "Routing plan is required."
            )

        if not number.isdigit():
            raise ValueError(
                "Invalid destination number."
            )

        if len(number) < 4:
            raise ValueError(
                "Destination number is too short."
            )

        return True

    @staticmethod
    def validate_route(route):

        if not route:
            raise RouteNotFound(
                "Route not found."
            )

        if not route.is_active:
            raise RouteNotFound(
                "Route is inactive."
            )

        if not route.termination.is_active:
            raise RouteNotFound(
                "Termination is inactive."
            )

        if not route.termination.carrier.is_active:
            raise RouteNotFound(
                "Carrier is inactive."
            )

        return True