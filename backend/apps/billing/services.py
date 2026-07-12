from decimal import Decimal
import math

from django.db.models import Q
from django.db.models.functions import Length
from django.shortcuts import get_object_or_404
from apps.cdr.models import CallRecord

from apps.accounts.constants import (
    SUPER_ADMIN,
    COMPANY_ADMIN,
)

from .models import Rate


class RateService:

    # =====================================================
    # CRUD
    # =====================================================

    @staticmethod
    def create_rate(data, user):

        return Rate.objects.create(
            created_by=user,
            **data,
        )

    @staticmethod
    def get_all(user):

        queryset = (
            Rate.objects
            .select_related("country")
        )

        if user.role in (
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ):
            return queryset

        return Rate.objects.none()

    @staticmethod
    def get_by_id(pk, user):

        queryset = (
            Rate.objects
            .select_related("country")
        )

        if user.role in (
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ):

            return get_object_or_404(
                queryset,
                pk=pk,
            )

        return get_object_or_404(
            Rate.objects.none(),
            pk=pk,
        )

    @staticmethod
    def update_rate(rate, data):

        for key, value in data.items():

            setattr(
                rate,
                key,
                value,
            )

        rate.save()

        return rate

    @staticmethod
    def delete_rate(rate):

        rate.delete()

    @staticmethod
    def search(user, keyword):

        queryset = RateService.get_all(user)

        if keyword:

            queryset = queryset.filter(

                Q(country__name__icontains=keyword)

                | Q(destination__icontains=keyword)

                | Q(prefix__icontains=keyword)

                | Q(provider__icontains=keyword)

            )

        return queryset
        # =====================================================
    # Longest Prefix Match
    # =====================================================

    @staticmethod
    def find_rate(destination_number):
        """
        Telecom Longest Prefix Match

        Example:

        Destination:
            447911223344

        Prefixes:
            44
            447
            4479
            44791

        Result:
            44791
        """

        if not destination_number:
            return None

        # Remove +, spaces etc.
        destination_number = (
            destination_number
            .replace("+", "")
            .replace("-", "")
            .replace(" ", "")
            .strip()
        )

        rates = (
            Rate.objects
            .filter(
                status="ACTIVE",
            )
            .annotate(
                prefix_length=Length("prefix")
            )
            .order_by(
                "-prefix_length",
                "country__name",
            )
        )

        for rate in rates:

            if destination_number.startswith(
                rate.prefix
            ):
                return rate

        return None

    # =====================================================
    # Billing Block
    # =====================================================

    @staticmethod
    def calculate_billable_seconds(
        duration,
        billing_block,
        minimum_duration,
    ):

        if duration <= 0:
            return 0

        # Minimum Duration
        if duration < minimum_duration:
            duration = minimum_duration

        # Billing Block

        return (
            math.ceil(
                duration / billing_block
            )
            * billing_block
        )
        # =====================================================
    # Amount Calculation
    # =====================================================

    @staticmethod
    def calculate_amount(
        billable_seconds,
        rate_per_minute,
        connection_charge=0,
    ):

        minutes = (
            Decimal(billable_seconds)
            / Decimal("60")
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

    # =====================================================
    # Rate CDR
    # =====================================================

    @staticmethod
    def rate_call(cdr):

        rate = RateService.find_rate(
            cdr.receiver_number
        )

        if not rate:
            return cdr

        billable_seconds = (
            RateService.calculate_billable_seconds(
                duration=cdr.billsec,
                billing_block=rate.billing_block,
                minimum_duration=rate.minimum_duration,
            )
        )

        amount = (
            RateService.calculate_amount(
                billable_seconds,
                rate.sell_rate,
                rate.connection_charge,
            )
        )

        cdr.country = rate.country

        cdr.destination = (
            rate.destination
        )

        cdr.prefix = (
            rate.prefix
        )

        cdr.provider = (
            rate.provider
        )

        cdr.buy_rate = (
            rate.buy_rate
        )

        cdr.sell_rate = (
            rate.sell_rate
        )

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
    
        # =====================================================
    # Rate Existing CDRs
    # =====================================================

    @staticmethod
    def rate_unrated_calls():

        unrated_calls = (
            CallRecord.objects
            .filter(
                amount=0,
            )
            .order_by("start_time")
        )

        total = 0

        for cdr in unrated_calls:

            try:

                RateService.rate_call(
                    cdr
                )

                total += 1

            except Exception as e:

                print(
                    f"Rating Error ({cdr.id}): {e}"
                )

        return total
    