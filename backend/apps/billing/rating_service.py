from decimal import Decimal
import math

from .models import Rate


class RatingService:

    @staticmethod
    def find_rate(phone_number):
        """
        Longest Prefix Match

        Example:

        447700123456

        Match:

        447

        before:

        44
        """

        rates = (
            Rate.objects.filter(
                status="ACTIVE",
            )
            .order_by("-prefix")
        )

        for rate in rates:

            if phone_number.startswith(
                rate.prefix
            ):
                return rate

        return None

    @staticmethod
    def calculate_billable_seconds(
        duration,
        billing_block,
    ):

        if duration <= 0:
            return 0

        return (
            math.ceil(
                duration / billing_block
            )
            * billing_block
        )

    @staticmethod
    def calculate_amount(
        billable_seconds,
        rate_per_minute,
        connection_charge=0,
    ):

        minutes = (
            Decimal(billable_seconds)
            / Decimal(60)
        )

        amount = (
            minutes
            * Decimal(rate_per_minute)
        )

        amount += Decimal(
            connection_charge
        )

        return amount.quantize(
            Decimal("0.000001")
        )

    @staticmethod
    def rate_call(cdr):
        """
        Rate a completed CDR.
        """

        phone_number = cdr.receiver_number

        if not phone_number:
            return cdr

        # Remove +
        phone_number = phone_number.replace(
            "+",
            "",
        )

        # Find Rate
        rate = RatingService.find_rate(
            phone_number
        )

        if not rate:
            return cdr

        # Calculate Billable Seconds
        billable_seconds = (
            RatingService.calculate_billable_seconds(
                cdr.billsec,
                rate.billing_block,
            )
        )

        # Calculate Amount
        amount = (
            RatingService.calculate_amount(
                billable_seconds,
                rate.sell_rate,
                rate.connection_charge,
            )
        )

        # Update CDR
        cdr.country = rate.country

        cdr.destination = rate.destination

        cdr.prefix = rate.prefix

        cdr.provider = rate.provider

        cdr.buy_rate = rate.buy_rate

        cdr.sell_rate = rate.sell_rate

        cdr.billing_block = (
            rate.billing_block
        )

        cdr.billable_seconds = (
            billable_seconds
        )

        cdr.amount = amount

        cdr.save(
            update_fields=[
                "country",
                "destination",
                "prefix",
                "provider",
                "buy_rate",
                "sell_rate",
                "billing_block",
                "billable_seconds",
                "amount",
            ]
        )

        return cdr