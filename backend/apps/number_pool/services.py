from django.shortcuts import get_object_or_404
from django.db.models import Q, ProtectedError
from django.db import transaction
from django.utils import timezone

from apps.accounts.constants import (
    SUPER_ADMIN,
    COMPANY_ADMIN,
)

from .models import (
    NumberPool,
    Country,
)


# =========================================================
# COUNTRY SERVICE
# =========================================================

class CountryService:

    # =====================================================
    # CREATE COUNTRY
    # =====================================================

    @staticmethod
    def create(data, user):

        return Country.objects.create(
            created_by=user,
            **data,
        )

    # =====================================================
    # GET ALL COUNTRIES
    # =====================================================

    @staticmethod
    def get_all(user, filters=None):

        queryset = Country.objects.all()

        if not filters:

            return queryset.order_by("name")

        search = filters.get("search")

        if search:

            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(iso_code__icontains=search)
                | Q(dial_code__icontains=search)
            )

        return queryset.order_by("name")

    # =====================================================
    # GET COUNTRY BY ID
    # =====================================================

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            Country,
            pk=pk,
        )

    # =====================================================
    # UPDATE COUNTRY
    # =====================================================

    @staticmethod
    def update(country, data):

        for key, value in data.items():

            setattr(
                country,
                key,
                value,
            )

        country.save()

        return country

    # =====================================================
    # DELETE NUMBER
    # =====================================================

    @staticmethod
    def delete_number(number):

        if number.status == "ASSIGNED":

            raise ValueError(
                "Assigned numbers cannot be deleted. "
                "Please unassign the number first."
            )

        if number.status == "RESERVED":

            raise ValueError(
                "Reserved numbers cannot be deleted. "
                "Please release the reservation first."
            )

        try:

            number.delete()

        except ProtectedError:

            raise ValueError(
                "This number is linked with other records "
                "and cannot be deleted."
            )


# =========================================================
# NUMBER POOL SERVICE
# =========================================================

class NumberPoolService:

    # =====================================================
    # CREATE NUMBER
    # =====================================================

    @staticmethod
    def create_number(data, user):

        # -------------------------------------------------
        # COMPANY ADMIN
        # -------------------------------------------------

        if user.role == COMPANY_ADMIN:

            data["admin"] = user

        # -------------------------------------------------
        # SUPER ADMIN
        # -------------------------------------------------

        elif user.role == SUPER_ADMIN:

            data["admin"] = data.get("admin")

        # -------------------------------------------------
        # CLIENT ASSIGNMENT
        # -------------------------------------------------

        if data.get("client"):

            data["status"] = "ASSIGNED"

            data["assigned_at"] = timezone.now()

        else:

            data["status"] = "AVAILABLE"

            data["assigned_at"] = None

        # -------------------------------------------------
        # CREATE
        # -------------------------------------------------

        return NumberPool.objects.create(
            created_by=user,
            **data,
        )

    # =====================================================
    # GET ALL NUMBERS
    #
    # SUPER_ADMIN
    # COMPANY_ADMIN
    #
    # Both admins can see ALL numbers.
    # =====================================================

    @staticmethod
    def get_all(user, filters=None):

        queryset = NumberPool.objects.select_related(
            "admin",
            "client",
            "country",
            "carrier",
            "termination",
        )

        # -------------------------------------------------
        # ACCESS
        # -------------------------------------------------

        if user.role in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            pass

        else:

            return NumberPool.objects.none()

        # -------------------------------------------------
        # NO FILTERS
        # -------------------------------------------------

        if not filters:

            return queryset.order_by(
                "did_number"
            )

        # -------------------------------------------------
        # FILTER VALUES
        # -------------------------------------------------

        search = filters.get("search")
        country = filters.get("country")
        carrier = filters.get("carrier")
        termination = filters.get("termination")
        status = filters.get("status")
        client = filters.get("client")

        # -------------------------------------------------
        # SEARCH
        # -------------------------------------------------

        if search:

            queryset = queryset.filter(

                Q(
                    did_number__icontains=search
                )

                |

                Q(
                    extension__icontains=search
                )

                |

                Q(
                    country__name__icontains=search
                )

                |

                Q(
                    carrier__name__icontains=search
                )

                |

                Q(
                    termination__name__icontains=search
                )

                |

                Q(
                    client__name__icontains=search
                )
            )

        # -------------------------------------------------
        # COUNTRY
        # -------------------------------------------------

        if country:

            queryset = queryset.filter(
                country_id=country
            )

        # -------------------------------------------------
        # CARRIER
        # -------------------------------------------------

        if carrier:

            queryset = queryset.filter(
                carrier_id=carrier
            )

        # -------------------------------------------------
        # TERMINATION
        # -------------------------------------------------

        if termination:

            queryset = queryset.filter(
                termination_id=termination
            )

        # -------------------------------------------------
        # STATUS
        # -------------------------------------------------

        if status:

            queryset = queryset.filter(
                status=status
            )

        # -------------------------------------------------
        # CLIENT
        # -------------------------------------------------

        if client:

            queryset = queryset.filter(
                client_id=client
            )

        # -------------------------------------------------
        # RESULT
        # -------------------------------------------------

        return queryset.order_by(
            "did_number"
        )

    # =====================================================
    # GET NUMBER BY ID
    #
    # Both admins can access any number.
    # =====================================================

    @staticmethod
    def get_by_id(pk, user):

        queryset = NumberPool.objects.select_related(
            "admin",
            "client",
            "country",
            "carrier",
            "termination",
        )

        if user.role in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            return get_object_or_404(
                queryset,
                pk=pk,
            )

        return get_object_or_404(
            NumberPool.objects.none(),
            pk=pk,
        )

    # =====================================================
    # UPDATE NUMBER
    # =====================================================

    @staticmethod
    def update_number(number, data, user):

        # -------------------------------------------------
        # COMPANY ADMIN
        # -------------------------------------------------

        if user.role == COMPANY_ADMIN:

            data.pop(
                "admin",
                None,
            )

        # -------------------------------------------------
        # CLIENT ASSIGNMENT
        # -------------------------------------------------

        if "client" in data:

            if data["client"]:

                data["status"] = "ASSIGNED"

                data["assigned_at"] = timezone.now()

            else:

                data["status"] = "AVAILABLE"

                data["assigned_at"] = None

        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        for key, value in data.items():

            setattr(
                number,
                key,
                value,
            )

        number.save()

        return number

    # =====================================================
    # DELETE NUMBER
    # =====================================================

    @staticmethod
    def delete_number(number):

        if number.status == "ASSIGNED":

            raise ValueError(
                "Assigned numbers cannot be deleted. "
                "Please unassign the number first."
            )

        if number.status == "RESERVED":

            raise ValueError(
                "Reserved numbers cannot be deleted. "
                "Please release the reservation first."
            )

        try:

            number.delete()

        except ProtectedError:

            raise ValueError(
                "This number is linked with other records "
                "and cannot be deleted."
            )

    # =====================================================
    # BULK ALLOCATION
    #
    # Payload:
    #
    # {
    #     "number_ids": [1, 2, 3],
    #     "client": 5
    # }
    #
    # =====================================================

    @staticmethod
    @transaction.atomic
    def bulk_allocate(data, user):

        number_ids = data["number_ids"]

        client = data["client"]

        # -------------------------------------------------
        # ACCESS CONTROL
        # -------------------------------------------------

        if user.role not in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            raise ValueError(
                "You do not have permission "
                "to allocate numbers."
            )

        # -------------------------------------------------
        # GET SELECTED NUMBERS
        # -------------------------------------------------

        numbers = list(
            NumberPool.objects
            .select_for_update()
            .filter(
                id__in=number_ids,
            )
        )

        # -------------------------------------------------
        # CHECK NUMBERS EXIST
        # -------------------------------------------------

        if not numbers:

            raise ValueError(
                "No numbers found."
            )

        # -------------------------------------------------
        # CHECK MISSING IDs
        # -------------------------------------------------

        found_ids = {
            number.id
            for number in numbers
        }

        missing_ids = [
            number_id
            for number_id in number_ids
            if number_id not in found_ids
        ]

        if missing_ids:

            raise ValueError(
                f"Number IDs not found: {missing_ids}"
            )

        # -------------------------------------------------
        # CHECK AVAILABILITY
        # -------------------------------------------------

        unavailable_numbers = [

            number.did_number

            for number in numbers

            if (
                number.status != "AVAILABLE"
                or number.client_id is not None
            )
        ]

        if unavailable_numbers:

            raise ValueError(
                "These numbers are not available: "
                + ", ".join(
                    unavailable_numbers
                )
            )

        # -------------------------------------------------
        # ASSIGN
        # -------------------------------------------------

        now = timezone.now()

        for number in numbers:

            number.client = client

            number.status = "ASSIGNED"

            number.assigned_at = now

        # -------------------------------------------------
        # BULK UPDATE
        # -------------------------------------------------

        NumberPool.objects.bulk_update(
            numbers,
            [
                "client",
                "status",
                "assigned_at",
            ],
        )

        return len(numbers)

    # =====================================================
    # BULK UNALLOCATION
    #
    # Payload:
    #
    # {
    #     "number_ids": [1, 2, 3]
    # }
    #
    # =====================================================

    @staticmethod
    @transaction.atomic
    def bulk_unallocate(data, user):

        number_ids = data["number_ids"]

        # -------------------------------------------------
        # ACCESS CONTROL
        # -------------------------------------------------

        if user.role not in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            raise ValueError(
                "You do not have permission "
                "to unallocate numbers."
            )

        # -------------------------------------------------
        # GET SELECTED NUMBERS
        # -------------------------------------------------

        numbers = list(
            NumberPool.objects
            .select_for_update()
            .filter(
                id__in=number_ids,
            )
        )

        # -------------------------------------------------
        # CHECK NUMBERS
        # -------------------------------------------------

        if not numbers:

            raise ValueError(
                "No numbers found."
            )

        # -------------------------------------------------
        # CHECK MISSING IDs
        # -------------------------------------------------

        found_ids = {
            number.id
            for number in numbers
        }

        missing_ids = [
            number_id
            for number_id in number_ids
            if number_id not in found_ids
        ]

        if missing_ids:

            raise ValueError(
                f"Number IDs not found: {missing_ids}"
            )

        # -------------------------------------------------
        # ONLY ASSIGNED NUMBERS
        # -------------------------------------------------

        assigned_numbers = [

            number

            for number in numbers

            if number.status == "ASSIGNED"
        ]

        if not assigned_numbers:

            raise ValueError(
                "No assigned numbers selected."
            )

        # -------------------------------------------------
        # UNASSIGN
        # -------------------------------------------------

        for number in assigned_numbers:

            number.client = None

            number.status = "AVAILABLE"

            number.assigned_at = None

        # -------------------------------------------------
        # BULK UPDATE
        # -------------------------------------------------

        NumberPool.objects.bulk_update(
            assigned_numbers,
            [
                "client",
                "status",
                "assigned_at",
            ],
        )

        return len(assigned_numbers)

    # =====================================================
    # AUTO ASSIGN NUMBERS
    #
    # Used by separate Assign Numbers page.
    #
    # Payload:
    #
    # {
    #     "carrier": 1,
    #     "termination": 5,
    #     "client": 10,
    #     "quantity": 20,
    #     "prefix": "",
    #     "payment_term": "Weekly"
    # }
    #
    # =====================================================

    @staticmethod
    @transaction.atomic
    def auto_assign(data, user):

        # -------------------------------------------------
        # ACCESS CONTROL
        # -------------------------------------------------

        if user.role not in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            raise ValueError(
                "You do not have permission "
                "to assign numbers."
            )

        # -------------------------------------------------
        # REQUEST DATA
        # -------------------------------------------------

        carrier = data["carrier"]

        termination = data.get(
            "termination"
        )

        client = data["client"]

        quantity = data["quantity"]

        prefix = (
            data.get("prefix")
            or ""
        ).strip()

        payment_term = (
            data.get("payment_term")
            or ""
        ).strip()

        # -------------------------------------------------
        # TERMINATION → CARRIER VALIDATION
        # -------------------------------------------------

        if termination:

            if termination.carrier_id != carrier.id:

                raise ValueError(
                    "Selected termination does not "
                    "belong to selected carrier."
                )

        # -------------------------------------------------
        # PAYMENT TERM
        # -------------------------------------------------

        if termination:

            termination_payment_term = (
                termination.payment_term
            )

            if payment_term:

                if (
                    payment_term
                    != termination_payment_term
                ):

                    raise ValueError(
                        "Selected payment term does not "
                        "match the selected termination."
                    )

            else:

                payment_term = (
                    termination_payment_term
                )

        # -------------------------------------------------
        # PREFIX
        # -------------------------------------------------

        # If frontend did not provide a prefix,
        # use the selected termination prefix.

        if termination and not prefix:

            prefix = (
                termination.prefix
                or ""
            ).strip()

        # -------------------------------------------------
        # BASE QUERY
        # -------------------------------------------------

        queryset = (
            NumberPool.objects
            .select_for_update()
            .filter(
                carrier=carrier,
                status="AVAILABLE",
                client__isnull=True,
            )
        )

        # -------------------------------------------------
        # TERMINATION FILTER
        # -------------------------------------------------

        if termination:

            queryset = queryset.filter(
                termination=termination
            )

        # -------------------------------------------------
        # PREFIX FILTER
        # -------------------------------------------------

        if prefix:

            queryset = queryset.filter(
                did_number__startswith=prefix
            )

        # -------------------------------------------------
        # ORDER
        # -------------------------------------------------

        queryset = queryset.order_by(
            "id"
        )

        # -------------------------------------------------
        # FETCH NUMBERS
        # -------------------------------------------------

        numbers = list(
            queryset[:quantity]
        )

        # -------------------------------------------------
        # CHECK AVAILABILITY
        # -------------------------------------------------

        if len(numbers) < quantity:

            available_count = len(numbers)

            raise ValueError(
                f"Only {available_count} matching "
                f"available numbers found. "
                f"You requested {quantity}."
            )

        # -------------------------------------------------
        # ASSIGN
        # -------------------------------------------------

        now = timezone.now()

        for number in numbers:

            number.client = client

            number.status = "ASSIGNED"

            number.assigned_at = now

        # -------------------------------------------------
        # BULK UPDATE
        # -------------------------------------------------

        NumberPool.objects.bulk_update(
            numbers,
            [
                "client",
                "status",
                "assigned_at",
            ],
        )

        # -------------------------------------------------
        # PAYOUT
        # -------------------------------------------------

        payout = None

        if termination:

            if payment_term == "Daily":

                payout = (
                    termination.daily_payout
                )

            elif payment_term == "Weekly":

                payout = (
                    termination.weekly_payout
                )

            elif payment_term == "Weekly7":

                payout = (
                    termination.weekly7_payout
                )

            elif payment_term == "Monthly30":

                payout = (
                    termination.monthly30_payout
                )

            elif payment_term == "Monthly45":

                payout = (
                    termination.monthly45_payout
                )

            elif payment_term == "Monthly60":

                payout = (
                    termination.monthly60_payout
                )

        # -------------------------------------------------
        # RESPONSE DATA
        # -------------------------------------------------

        return {
            "requested": quantity,

            "allocated": len(numbers),

            "client_id": client.id,

            "client_name": client.name,

            "carrier_id": carrier.id,

            "carrier_name": carrier.name,

            "termination_id": (
                termination.id
                if termination
                else None
            ),

            "termination_name": (
                termination.name
                if termination
                else None
            ),

            "prefix": prefix,

            "payment_term": payment_term,

            "payout": payout,

            "numbers": [

                {
                    "id": number.id,

                    "did_number": (
                        number.did_number
                    ),

                    "extension": (
                        number.extension
                    ),

                    "termination_id": (
                        number.termination_id
                    ),
                }

                for number in numbers
            ],
        }