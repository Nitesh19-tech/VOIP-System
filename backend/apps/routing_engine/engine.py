from .exceptions import RouteNotFound
from .models import RoutingResult
from .selectors import RouteSelector
from .utils import NumberUtils
from .validator import RouteValidator


class RouteEngine:

    # =====================================================
    # Resolve Routes
    # =====================================================

    @staticmethod
    def resolve(number, routing_plan):

        RouteValidator.validate(
            number,
            routing_plan,
        )

        number = NumberUtils.normalize(number)

        routes = RouteSelector.get_matching_routes(
            number,
            routing_plan,
        )

        if not routes:
            raise RouteNotFound(
                f"No Route Found For {number}"
            )

        results = []

        for route in routes:

            RouteValidator.validate_route(route)

            results.append(
                RouteEngine._build_result(
                    route,
                    number,
                )
            )

        return results

    # =====================================================
    # Build Routing Result
    # =====================================================

    @staticmethod
    def _build_result(route, number):

        dial_number = NumberUtils.strip_digits(
            number,
            route.strip_digits,
        )

        dial_number = NumberUtils.add_prefix(
            dial_number,
            route.add_prefix,
        )

        return RoutingResult(

            route=route,

            routing_plan=route.routing_plan,

            termination=route.termination,

            carrier=route.termination.carrier,

            priority=route.priority,

            cost=route.termination.carrier_payout,

            original_number=number,

            dial_number=dial_number,

        )

    # =====================================================
    # Best Route
    # =====================================================

    @staticmethod
    def get_best_route(number, routing_plan):

        return RouteEngine.resolve(
            number,
            routing_plan,
        )[0]

    # =====================================================
    # All Routes
    # =====================================================

    @staticmethod
    def get_routes(number, routing_plan):

        return RouteEngine.resolve(
            number,
            routing_plan,
        )

    # =====================================================
    # Build Dial String
    # =====================================================

    @staticmethod
    def build_dial_string(number, routing_plan):

        result = RouteEngine.get_best_route(
            number,
            routing_plan,
        )

        return (
            f"PJSIP/{result.dial_number}"
            f"@{result.carrier.name}"
        )

    # =====================================================
    # Get Carrier
    # =====================================================

    @staticmethod
    def get_carrier(number, routing_plan):

        return RouteEngine.get_best_route(
            number,
            routing_plan,
        ).carrier

    # =====================================================
    # Get Termination
    # =====================================================

    @staticmethod
    def get_termination(number, routing_plan):

        return RouteEngine.get_best_route(
            number,
            routing_plan,
        ).termination