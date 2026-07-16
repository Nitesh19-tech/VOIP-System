from decimal import Decimal


class RatingEngine:

    @staticmethod
    def rate(routing_result):

        termination = routing_result.termination

        return {

            "currency": termination.currency,

            "buy_rate": termination.carrier_payout,

            "payment_term": termination.payment_term,

            "minimum_duration": termination.max_duration,

            "billing_increment": 60,

        }

    @staticmethod
    def calculate_cost(duration, buy_rate):

        if duration <= 0:
            return Decimal("0.0000")

        minutes = Decimal(duration) / Decimal(60)

        return (
            minutes * buy_rate
        ).quantize(
            Decimal("0.0001")
        )