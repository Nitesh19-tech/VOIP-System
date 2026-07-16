from .engine import RouteEngine
from .permissions import CallPermission
from apps.billing.rating_engine import RatingEngine


class OutboundCallProcessor:

    @staticmethod
    def process(client, number, routing_plan):

        result = RouteEngine.get_best_route(
            number,
            routing_plan,
        )

        CallPermission.validate(
            client,
            result,
        )

        rating = RatingEngine.rate(
            result,
        )

        return {

            "routing": result,

            "rating": rating,

        }