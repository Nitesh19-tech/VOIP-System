import re

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

from apps.asterisk.asterisk_service import AsteriskService


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


# =========================================================
# NUMBER POOL SERVICE
# =========================================================

class NumberPoolService:

    # =====================================================
    # ASTERISK INBOUND SYNC
    # =====================================================

    @staticmethod
    def sync_asterisk_inbound():

        try:

            AsteriskService.upload_inbound()
            AsteriskService.reload_dialplan()

        except Exception as e:

            print(
                f"Asterisk inbound provisioning failed: {e}"
            )

    # =====================================================
    # CREATE NUMBER
    # =====================================================

    @staticmethod
    def _normalize_number(value):

        value = str(value or "").strip()

        return value.replace(" ", "")

    @staticmethod
    def _numbers_from_payload(data):

        mode = str(
            data.get("number_mode")
            or "SINGLE"
        ).upper()

        first = NumberPoolService._normalize_number(
            data.get("number")
            or data.get("did_number")
        )

        if mode == "SINGLE":

            if not first:

                raise ValueError(
                    "Number is required."
                )

            return [first]

        if mode == "RANGE":

            if not first:

                raise ValueError(
                    "First number is required."
                )

            try:

                length = int(
                    data.get("length")
                    or data.get("total_numbers")
                    or 1
                )

            except (
                TypeError,
                ValueError,
            ):

                raise ValueError(
                    "Total Numbers must be a valid integer."
                )

            if length < 1:

                raise ValueError(
                    "Total Numbers must be greater than zero."
                )

            if length > 10000:

                raise ValueError(
                    "Maximum 10000 numbers can be created at once."
                )

            if not first.isdigit():

                raise ValueError(
                    "Range must start with a numeric number."
                )

            width = len(first)

            base = int(first)

            return [
                str(base + i).zfill(width)
                for i in range(length)
            ]

        if mode == "LIST":

            raw = (
                data.get("number_list")
                or first
            )

            values = (
                re.split(
                    r"[,;\n\r]+",
                    raw,
                )
                if isinstance(raw, str)
                else raw
            )

            numbers = list(
                dict.fromkeys(
                    NumberPoolService._normalize_number(v)
                    for v in values
                    if NumberPoolService._normalize_number(v)
                )
            )

            if not numbers:

                raise ValueError(
                    "Number list is empty."
                )

            if len(numbers) > 10000:

                raise ValueError(
                    "Maximum 10000 numbers can be created at once."
                )

            return numbers

        if mode == "CSV":

            values = (
                data.get("csv_numbers")
                or data.get("number_list")
                or []
            )

            if isinstance(values, str):

                values = re.split(
                    r"[,;\n\r]+",
                    values,
                )

            numbers = list(
                dict.fromkeys(
                    NumberPoolService._normalize_number(v)
                    for v in values
                    if NumberPoolService._normalize_number(v)
                )
            )

            if not numbers:

                raise ValueError(
                    "CSV does not contain any valid numbers."
                )

            if len(numbers) > 10000:

                raise ValueError(
                    "Maximum 10000 numbers can be created at once."
                )

            return numbers

        raise ValueError(
            "Invalid number add option."
        )

    @staticmethod
    def _resolve_country(
        number,
        country=None,
    ):

        if country:

            return country

        digits = re.sub(
            r"\D",
            "",
            str(number or ""),
        )

        if not digits:

            raise ValueError(
                f"Invalid number: {number}"
            )

        for item in Country.objects.all().order_by(
            "-dial_code"
        ):

            dial = re.sub(
                r"\D",
                "",
                str(item.dial_code or ""),
            )

            if dial and digits.startswith(dial):

                return item

        raise ValueError(
            f"Country could not be detected for number {number}. "
            "Please select a country."
        )

    @staticmethod
    def create_number(
        data,
        user,
    ):

        data = dict(data)

        # -------------------------------------------------
        # ADMIN
        # -------------------------------------------------

        if user.role == COMPANY_ADMIN:

            data["admin"] = user

        elif user.role == SUPER_ADMIN:

            data["admin"] = data.get("admin")

        # -------------------------------------------------
        # CARRIER / TERMINATION
        # -------------------------------------------------

        carrier = data.get("carrier")

        termination = data.get("termination")

        if not carrier:

            raise ValueError(
                "Carrier is required."
            )

        if not termination:

            raise ValueError(
                "Termination is required."
            )

        if termination.carrier_id != carrier.id:

            raise ValueError(
                "Selected termination does not belong to selected carrier."
            )

        # -------------------------------------------------
        # NUMBERS
        # -------------------------------------------------

        numbers = NumberPoolService._numbers_from_payload(
            data
        )

        mode = str(
            data.get("number_mode")
            or "SINGLE"
        ).upper()

        if mode not in {
            "SINGLE",
            "RANGE",
            "LIST",
            "CSV",
        }:

            raise ValueError(
                "Invalid number add option."
            )

        # -------------------------------------------------
        # NUMBER TYPE
        # -------------------------------------------------

        number_type = str(
            data.get("number_type")
            or "GENERAL"
        ).upper()

        if number_type not in {
            "TEST",
            "GENERAL",
        }:

            number_type = "GENERAL"

        # -------------------------------------------------
        # TEST NUMBER
        # -------------------------------------------------

        set_test_number = bool(
            data.get("set_test_number")
            or data.get("is_test_number")
        )

        test_index = (
            0
            if set_test_number
            else None
        )

        # -------------------------------------------------
        # NUMBER OPTIONS
        # -------------------------------------------------

        try:

            daily_max_call = int(
                data.get("daily_max_call")
                or 0
            )

        except (
            TypeError,
            ValueError,
        ):

            raise ValueError(
                "Daily Max Call must be a valid integer."
            )

        try:

            daily_max_duration = int(
                data.get("daily_max_duration")
                or 0
            )

        except (
            TypeError,
            ValueError,
        ):

            raise ValueError(
                "Daily Max Duration must be a valid integer."
            )

        if daily_max_call < 0:

            raise ValueError(
                "Daily Max Call cannot be negative."
            )

        if daily_max_duration < 0:

            raise ValueError(
                "Daily Max Duration cannot be negative."
            )

        number_service = str(
            data.get("number_service")
            or data.get("service_id")
            or ""
        ).strip()

        service_variables = (
            data.get("service_variables")
            or {}
        )

        if not isinstance(
            service_variables,
            dict,
        ):

            raise ValueError(
                "Service variables must be a JSON object."
            )

        # -------------------------------------------------
        # TOTAL NUMBERS
        # -------------------------------------------------

        if mode == "RANGE":

            total_numbers = int(
                data.get("length")
                or data.get("total_numbers")
                or 1
            )

        else:

            total_numbers = len(numbers)

        if total_numbers < 1:

            raise ValueError(
                "Total Numbers must be greater than zero."
            )

        # -------------------------------------------------
        # COUNTRY
        # -------------------------------------------------

        country_hint = data.get("country")

        # -------------------------------------------------
        # CREATE
        # -------------------------------------------------

        created = []

        with transaction.atomic():

            existing = set(
                NumberPool.objects.filter(
                    did_number__in=numbers
                ).values_list(
                    "did_number",
                    flat=True,
                )
            )

            if existing:

                raise ValueError(
                    "These numbers already exist: "
                    + ", ".join(
                        sorted(existing)[:20]
                    )
                )

            now = timezone.now()

            for index, value in enumerate(
                numbers
            ):

                country = (
                    NumberPoolService
                    ._resolve_country(
                        value,
                        country_hint,
                    )
                )

                current_is_test = (
                    index == test_index
                )

                current_number_type = (
                    "TEST"
                    if (
                        current_is_test
                        or number_type == "TEST"
                    )
                    else "GENERAL"
                )

                created.append(
                    NumberPool.objects.create(

                        created_by=user,

                        admin=data.get("admin"),

                        client=data.get("client"),

                        carrier=carrier,

                        termination=termination,

                        country=country,

                        did_number=value,

                        number=value,

                        status="ASSIGNED",

                        assigned_at=now,

                        number_type=current_number_type,

                        number_mode=mode,

                        total_numbers=total_numbers,

                        daily_max_call=daily_max_call,

                        daily_max_duration=daily_max_duration,

                        number_service=number_service,

                        service_variables=service_variables,

                        is_test_number=(
                            current_is_test
                            or number_type == "TEST"
                        ),

                        purchase_price=data.get(
                            "purchase_price",
                            0,
                        ),

                        monthly_rental=data.get(
                            "monthly_rental",
                            0,
                        ),

                        description=data.get(
                            "description",
                            "",
                        ),
                    )
                )

            transaction.on_commit(
                NumberPoolService.sync_asterisk_inbound
            )

        return (
            created[0]
            if len(created) == 1
            else created
        )

    # =====================================================
    # GET ALL NUMBERS
    # =====================================================

    @staticmethod
    def get_all(
        user,
        filters=None,
    ):

        filters = filters or {}

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

        if user.role not in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            return {
                "results":
                    NumberPool.objects.none(),

                "count":
                    0,

                "page":
                    1,

                "page_size":
                    25,

                "total_pages":
                    0,

                "next":
                    None,

                "previous":
                    None,
            }

        # -------------------------------------------------
        # FILTER VALUES
        # -------------------------------------------------

        search = filters.get("search")

        country = filters.get("country")

        carrier = filters.get("carrier")

        termination = filters.get(
            "termination"
        )

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

                | Q(
                    country__name__icontains=search
                )

                | Q(
                    carrier__name__icontains=search
                )

                | Q(
                    termination__name__icontains=search
                )

                | Q(
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
        # ORDER
        # -------------------------------------------------

        queryset = queryset.order_by(
            "did_number"
        )

        # =================================================
        # PAGINATION
        # =================================================

        try:
            page = int(
                filters.get(
                    "page",
                    1,
                )
            )
        except (
            TypeError,
            ValueError,
        ):
            page = 1

        if page < 1:
            page = 1

        # -------------------------------------------------
        # PAGE SIZE
        # -------------------------------------------------

        raw_page_size = filters.get(
            "page_size",
            "25",
        )

        # =================================================
        # ALL RECORDS
        # =================================================

        if (
            isinstance(raw_page_size, str)
            and raw_page_size.strip().lower() == "all"
        ):

            all_results = list(queryset)

            total_count = len(all_results)

            return {
                "results": all_results,
                "count": total_count,
                "page": 1,
                "page_size": "all",
                "total_pages": 1 if total_count else 0,
                "next": None,
                "previous": None,
            }

        # =================================================
        # NORMAL PAGE SIZE
        # =================================================

        try:
            page_size = int(raw_page_size)
        except (
            TypeError,
            ValueError,
        ):
            page_size = 25

        # Supported UI values:
        # 25 / 50 / 100 / 500

        allowed_page_sizes = {
            25,
            50,
            100,
            500,
        }

        if page_size not in allowed_page_sizes:
            page_size = 25

        # -------------------------------------------------
        # TOTAL COUNT
        # -------------------------------------------------

        total_count = queryset.count()

        # -------------------------------------------------
        # TOTAL PAGES
        # -------------------------------------------------

        total_pages = (
            (
                total_count
                + page_size
                - 1
            )
            // page_size
            if total_count
            else 0
        )

        # -------------------------------------------------
        # VALID PAGE
        # -------------------------------------------------

        if (
            total_pages > 0
            and page > total_pages
        ):
            page = total_pages

        # -------------------------------------------------
        # SLICE
        # -------------------------------------------------

        start_index = (
            (page - 1)
            * page_size
        )

        end_index = (
            start_index
            + page_size
        )

        results = queryset[
            start_index:end_index
        ]

        # -------------------------------------------------
        # NEXT / PREVIOUS
        # -------------------------------------------------

        next_page = (
            page + 1
            if (
                total_pages > 0
                and page < total_pages
            )
            else None
        )

        previous_page = (
            page - 1
            if page > 1
            else None
        )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {
            "results": results,
            "count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "next": next_page,
            "previous": previous_page,
        }

    # =====================================================
    # GET NUMBER BY ID
    # =====================================================

    @staticmethod
    def get_by_id(
        pk,
        user,
    ):

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
    def update_number(
        number,
        data,
        user,
    ):

        # -------------------------------------------------
        # COMPANY ADMIN
        # -------------------------------------------------

        if user.role == COMPANY_ADMIN:

            data.pop(
                "admin",
                None,
            )

        # -------------------------------------------------
        # CARRIER / TERMINATION VALIDATION
        # -------------------------------------------------

        carrier = data.get(
            "carrier",
            number.carrier,
        )

        termination = data.get(
            "termination",
            number.termination,
        )

        if termination:

            if not carrier:

                raise ValueError(
                    "A carrier is required when "
                    "a termination is selected."
                )

            if termination.carrier_id != carrier.id:

                raise ValueError(
                    "Selected termination does not "
                    "belong to selected carrier."
                )

        # -------------------------------------------------
        # UI ONLY FIELDS
        # -------------------------------------------------

        data.pop(
            "number_list",
            None,
        )

        data.pop(
            "csv_numbers",
            None,
        )

        data.pop(
            "number",
            None,
        )

        if "length" in data:

            try:

                data["total_numbers"] = int(
                    data.pop("length")
                )

            except (
                TypeError,
                ValueError,
            ):

                raise ValueError(
                    "Total Numbers must be a valid integer."
                )

        if "set_test_number" in data:

            data["is_test_number"] = bool(
                data.pop("set_test_number")
            )

            if data["is_test_number"]:

                data["number_type"] = "TEST"

        # -------------------------------------------------
        # NUMBER ASSIGNMENT
        # -------------------------------------------------

        final_carrier = (
            data.get("carrier")
            if "carrier" in data
            else number.carrier
        )

        final_termination = (
            data.get("termination")
            if "termination" in data
            else number.termination
        )

        if (
            final_carrier
            and final_termination
        ):

            data["status"] = "ASSIGNED"

            data["assigned_at"] = (
                data.get("assigned_at")
                or number.assigned_at
                or timezone.now()
            )

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

        # -------------------------------------------------
        # ASTERISK SYNC
        # -------------------------------------------------

        transaction.on_commit(
            NumberPoolService.sync_asterisk_inbound
        )

        return number

    # =====================================================
    # DELETE NUMBER
    # =====================================================

    @staticmethod
    def delete_number(
        number
    ):

        try:

            number.delete()

        except ProtectedError:

            raise ValueError(
                "This number is linked with other records "
                "and cannot be deleted."
            )

        transaction.on_commit(
            NumberPoolService.sync_asterisk_inbound
        )

    # =====================================================
    # BULK ALLOCATION
    # =====================================================

    @staticmethod
    @transaction.atomic
    def bulk_allocate(
        data,
        user,
    ):

        number_ids = data["number_ids"]

        carrier = data["carrier"]

        termination = data["termination"]

        client = data.get("client")

        if user.role not in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            raise ValueError(
                "You do not have permission "
                "to allocate numbers."
            )

        if termination.carrier_id != carrier.id:

            raise ValueError(
                "Selected termination does not "
                "belong to selected carrier."
            )

        numbers = list(
            NumberPool.objects
            .select_for_update()
            .filter(
                id__in=number_ids,
            )
        )

        if not numbers:

            raise ValueError(
                "No numbers found."
            )

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

        unavailable_numbers = [

            number.did_number

            for number in numbers

            if number.status != "AVAILABLE"
        ]

        if unavailable_numbers:

            raise ValueError(
                "These numbers are not available: "
                + ", ".join(
                    unavailable_numbers
                )
            )

        now = timezone.now()

        for number in numbers:

            number.carrier = carrier

            number.termination = termination

            number.client = client

            number.status = "ASSIGNED"

            number.assigned_at = now

        NumberPool.objects.bulk_update(
            numbers,
            [
                "carrier",
                "termination",
                "client",
                "status",
                "assigned_at",
            ],
        )

        transaction.on_commit(
            NumberPoolService.sync_asterisk_inbound
        )

        return len(numbers)

    # =====================================================
    # BULK UNALLOCATION
    # =====================================================

    @staticmethod
    @transaction.atomic
    def bulk_unallocate(
        data,
        user,
    ):

        number_ids = data["number_ids"]

        if user.role not in [
            SUPER_ADMIN,
            COMPANY_ADMIN,
        ]:

            raise ValueError(
                "You do not have permission "
                "to unallocate numbers."
            )

        numbers = list(
            NumberPool.objects
            .select_for_update()
            .filter(
                id__in=number_ids,
            )
        )

        if not numbers:

            raise ValueError(
                "No numbers found."
            )

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

        assigned_numbers = [

            number

            for number in numbers

            if number.status == "ASSIGNED"
        ]

        if not assigned_numbers:

            raise ValueError(
                "No assigned numbers selected."
            )

        for number in assigned_numbers:

            number.client = None

            number.carrier = None

            number.termination = None

            number.status = "AVAILABLE"

            number.assigned_at = None

        NumberPool.objects.bulk_update(
            assigned_numbers,
            [
                "client",
                "carrier",
                "termination",
                "status",
                "assigned_at",
            ],
        )

        transaction.on_commit(
            NumberPoolService.sync_asterisk_inbound
        )

        return len(assigned_numbers)

    # =====================================================
    # AUTO ASSIGN NUMBERS
    # =====================================================

    @staticmethod
    @transaction.atomic
    def auto_assign(
        data,
        user,
    ):

        # -------------------------------------------------
        # PERMISSION
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
        # BASIC DATA
        # -------------------------------------------------

        carrier = data.get("carrier")

        termination = data.get(
            "termination"
        )

        # Client is OPTIONAL.
        # If no client is selected, the numbers will still
        # be assigned to carrier + termination.
        client = data.get(
            "client"
        )

        quantity = data.get(
            "quantity"
        )

        if not carrier:
            raise ValueError(
                "Carrier is required."
            )

        if not termination:
            raise ValueError(
                "Termination is required."
            )

        try:

            quantity = int(
                quantity
            )

        except (
            TypeError,
            ValueError,
        ):

            raise ValueError(
                "Quantity must be a valid integer."
            )

        if quantity < 1:
            raise ValueError(
                "Quantity must be greater than zero."
            )

        # -------------------------------------------------
        # CARRIER / TERMINATION VALIDATION
        # -------------------------------------------------

        if termination.carrier_id != carrier.id:

            raise ValueError(
                "Selected termination does not "
                "belong to selected carrier."
            )

        # -------------------------------------------------
        # PAYMENT TERM
        # -------------------------------------------------

        prefix = (
            data.get("prefix")
            or ""
        ).strip()

        payment_term = (
            data.get("payment_term")
            or ""
        ).strip()

        termination_payment_term = (
            termination.payment_term
            or ""
        ).strip()

        if payment_term:

            if (
                termination_payment_term
                and payment_term
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

        # If frontend does not explicitly provide a prefix,
        # use the selected termination's prefix.
        if not prefix:

            prefix = (
                termination.prefix
                or ""
            ).strip()

        # -------------------------------------------------
        # AVAILABLE NUMBERS QUERY
        # -------------------------------------------------

        queryset = (
            NumberPool.objects
            .select_for_update()
            .filter(
                status="AVAILABLE",
                carrier__isnull=True,
                termination__isnull=True,
            )
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
        # FETCH REQUIRED NUMBERS
        # -------------------------------------------------

        numbers = list(
            queryset[:quantity]
        )

        if len(numbers) < quantity:

            available_count = len(
                numbers
            )

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

            number.carrier = carrier

            number.termination = termination

            # Client can intentionally remain None.
            number.client = client

            number.status = "ASSIGNED"

            number.assigned_at = now

        NumberPool.objects.bulk_update(
            numbers,
            [
                "carrier",
                "termination",
                "client",
                "status",
                "assigned_at",
            ],
        )

        # -------------------------------------------------
        # ASTERISK SYNC
        # -------------------------------------------------

        transaction.on_commit(
            NumberPoolService.sync_asterisk_inbound
        )

        # -------------------------------------------------
        # PAYOUT
        # -------------------------------------------------

        payout = None

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
        # RESPONSE
        # -------------------------------------------------

        return {

            "requested":
                quantity,

            "allocated":
                len(numbers),

            "client_id": (
                client.id
                if client
                else None
            ),

            "client_name": (
                client.name
                if client
                else None
            ),

            "carrier_id":
                carrier.id,

            "carrier_name":
                carrier.name,

            "termination_id":
                termination.id,

            "termination_name":
                termination.name,

            "prefix":
                prefix,

            "payment_term":
                payment_term,

            "payout":
                payout,

            "numbers": [

                {
                    "id":
                        number.id,

                    "did_number":
                        number.did_number,

                    "carrier_id":
                        number.carrier_id,

                    "termination_id":
                        number.termination_id,

                    "client_id":
                        number.client_id,
                }

                for number in numbers

            ],
        }
