from django.shortcuts import get_object_or_404
from django.db import transaction

import csv
import io

from decimal import Decimal, InvalidOperation

from .models import (
    Carrier,
    CarrierIP,
    Termination,
)


# =========================================================
# CARRIER SERVICE
# =========================================================

class CarrierService:

    @staticmethod
    def get_all(user, params=None):

        queryset = Carrier.objects.all()

        params = params or {}

        search = params.get("search")

        if search:
            queryset = queryset.filter(
                name__icontains=search
            )

        return queryset

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            Carrier,
            pk=pk,
        )

    @staticmethod
    def create_carrier(data, user):

        carrier = Carrier.objects.create(
            **data,
            created_by=user,
        )

        return carrier

    @staticmethod
    def update_carrier(
        carrier,
        data,
        user,
    ):

        for key, value in data.items():

            setattr(
                carrier,
                key,
                value,
            )

        carrier.save()

        return carrier

    @staticmethod
    def delete_carrier(carrier):

        carrier.delete()


# =========================================================
# CARRIER IP SERVICE
# =========================================================

class CarrierIPService:

    @staticmethod
    def get_all(user, params=None):

        queryset = CarrierIP.objects.select_related(
            "carrier"
        )

        params = params or {}

        carrier = params.get("carrier")

        if carrier:

            queryset = queryset.filter(
                carrier_id=carrier
            )

        return queryset

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            CarrierIP,
            pk=pk,
        )

    @staticmethod
    def create_ip(data, user):

        ip = CarrierIP.objects.create(
            **data,
            created_by=user,
        )

        return ip

    @staticmethod
    def update_ip(
        ip,
        data,
        user,
    ):

        for key, value in data.items():

            setattr(
                ip,
                key,
                value,
            )

        ip.save()

        return ip

    @staticmethod
    def delete_ip(ip):

        ip.delete()


# =========================================================
# TERMINATION SERVICE
# =========================================================

class TerminationService:

    @staticmethod
    def get_all(user, params=None):

        queryset = Termination.objects.select_related(
            "carrier"
        )

        params = params or {}

        search = params.get("search")

        if search:

            queryset = queryset.filter(
                name__icontains=search
            )

        carrier = params.get("carrier")

        if carrier:

            queryset = queryset.filter(
                carrier_id=carrier
            )

        return queryset

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            Termination,
            pk=pk,
        )

    @staticmethod
    def create_termination(
        data,
        user,
    ):

        termination = Termination.objects.create(
            **data,
            created_by=user,
        )

        return termination

    @staticmethod
    def update_termination(
        termination,
        data,
        user,
    ):

        for key, value in data.items():

            setattr(
                termination,
                key,
                value,
            )

        termination.save()

        return termination

    @staticmethod
    def delete_termination(
        termination,
    ):

        termination.delete()

    # =====================================================
    # CSV IMPORT HELPERS
    # =====================================================

    @staticmethod
    def _decimal(value):

        value = (value or "").strip()

        if not value:

            return Decimal("0")

        try:

            return Decimal(value)

        except (
            InvalidOperation,
            ValueError,
        ):

            raise ValueError(
                f"Invalid decimal value: {value}"
            )

    @staticmethod
    def _integer(value):

        value = (value or "").strip()

        if not value:

            return 0

        try:

            return int(
                float(value)
            )

        except (
            ValueError,
            TypeError,
        ):

            raise ValueError(
                f"Invalid integer value: {value}"
            )

    # =====================================================
    # IMPORT TERMINATION CSV
    # =====================================================

    @staticmethod
    def import_csv(
        file_obj,
        user,
        carrier_name="saurabh1",
    ):
        """
        Import Termination CSV.

        Supports BOTH formats.

        OLD FORMAT:

            Name
            Prefix
            Currency
            Carrier Term
            Carrier Payout
            D|W|W7|M30|M45|M60
            Active
            Info
            Max Duration
            Action

        NEW FORMAT:

            carrier
            name
            prefix
            currency
            payment_term
            carrier_payout
            daily_payout
            weekly_payout
            weekly7_payout
            monthly30_payout
            monthly45_payout
            monthly60_payout
            max_duration
            info

        Carrier is forced to carrier_name.
        Default carrier = saurabh1.

        Existing records with same
        carrier + name are updated.
        """

        # =================================================
        # FIND CARRIER
        # =================================================

        carrier = Carrier.objects.filter(
            name__iexact=carrier_name
        ).first()

        if not carrier:

            raise ValueError(
                f"Carrier '{carrier_name}' not found."
            )

        # =================================================
        # READ CSV
        # =================================================

        raw = file_obj.read()

        if isinstance(raw, bytes):

            raw = raw.decode(
                "utf-8-sig"
            )

        else:

            raw = raw.lstrip(
                "\ufeff"
            )

        # =================================================
        # CSV READER
        # =================================================
        #
        # CSV files are comma separated.
        #
        # We intentionally do NOT use csv.Sniffer()
        # because payout values contain "|" characters.
        # =================================================

        reader = csv.DictReader(
            io.StringIO(raw),
            delimiter=",",
        )

        fieldnames = reader.fieldnames or []

        # =================================================
        # CLEAN HEADERS
        # =================================================

        fieldnames = [
            field.strip()
            if field
            else field
            for field in fieldnames
        ]

        reader.fieldnames = fieldnames

        # =================================================
        # HEADER MAP
        # =================================================

        header_map = {}

        for field in fieldnames:

            if field:

                header_map[
                    field.strip().lower()
                ] = field

        def get_column(row, *names):

            for name in names:

                actual_column = header_map.get(
                    name.strip().lower()
                )

                if actual_column is not None:

                    return row.get(
                        actual_column
                    )

            return None

        # =================================================
        # DETECT FORMAT
        # =================================================

        new_format = (
            "name" in header_map
            and "payment_term" in header_map
        )

        old_format = (
            "name" in header_map
            and "carrier term" in header_map
        )

        if not new_format and not old_format:

            raise ValueError(
                "Invalid Termination CSV format. "
                "Expected original Callpanel CSV "
                "or processed termination CSV."
            )

        # =================================================
        # OLD FORMAT PAYOUT COLUMN
        # =================================================

        payout_column = None

        if old_format:

            for field in fieldnames:

                if not field:

                    continue

                normalized = (
                    field
                    .replace(" ", "")
                    .strip()
                    .lower()
                )

                if normalized == (
                    "d|w|w7|m30|m45|m60"
                ):

                    payout_column = field

                    break

            if not payout_column:

                raise ValueError(
                    "Missing CSV column: "
                    "D|W|W7|M30|M45|M60"
                )

        # =================================================
        # RESULT COUNTERS
        # =================================================

        created = 0
        updated = 0
        failed = 0

        errors = []

        # =================================================
        # IMPORT
        # =================================================

        with transaction.atomic():

            for row_number, row in enumerate(
                reader,
                start=2,
            ):

                try:

                    # =====================================
                    # NAME
                    # =====================================

                    name = (
                        get_column(
                            row,
                            "name",
                            "Name",
                        )
                        or ""
                    ).strip()

                    if not name:

                        raise ValueError(
                            "Name is empty"
                        )

                    # =====================================
                    # PREFIX
                    # =====================================

                    prefix = (
                        get_column(
                            row,
                            "prefix",
                            "Prefix",
                        )
                        or ""
                    ).strip()

                    # =====================================
                    # CURRENCY
                    # =====================================

                    currency = (
                        get_column(
                            row,
                            "currency",
                            "Currency",
                        )
                        or "USD"
                    ).strip() or "USD"

                    # =====================================
                    # PAYMENT TERM
                    # =====================================

                    payment_term = (
                        get_column(
                            row,
                            "payment_term",
                            "Carrier Term",
                        )
                        or ""
                    ).strip()

                    if not payment_term:

                        payment_term = "Monthly30"

                    valid_payment_terms = {
                        "Daily",
                        "Weekly",
                        "Weekly7",
                        "Monthly30",
                        "Monthly45",
                        "Monthly60",
                    }

                    if payment_term not in valid_payment_terms:

                        raise ValueError(
                            "Invalid Payment Term: "
                            f"{payment_term}"
                        )

                    # =====================================
                    # CARRIER PAYOUT
                    # =====================================

                    carrier_payout = (
                        get_column(
                            row,
                            "carrier_payout",
                            "Carrier Payout",
                        )
                        or "0"
                    )

                    # =====================================
                    # PAYOUT VALUES
                    # =====================================

                    if new_format:

                        daily_payout = (
                            get_column(
                                row,
                                "daily_payout",
                            )
                            or "0"
                        )

                        weekly_payout = (
                            get_column(
                                row,
                                "weekly_payout",
                            )
                            or "0"
                        )

                        weekly7_payout = (
                            get_column(
                                row,
                                "weekly7_payout",
                            )
                            or "0"
                        )

                        monthly30_payout = (
                            get_column(
                                row,
                                "monthly30_payout",
                            )
                            or "0"
                        )

                        monthly45_payout = (
                            get_column(
                                row,
                                "monthly45_payout",
                            )
                            or "0"
                        )

                        monthly60_payout = (
                            get_column(
                                row,
                                "monthly60_payout",
                            )
                            or "0"
                        )

                    else:

                        payout_string = (
                            row.get(
                                payout_column
                            )
                            or ""
                        ).strip()

                        payouts = (
                            payout_string.split(
                                "|"
                            )
                        )

                        # Always keep exactly six values

                        payouts = (
                            payouts
                            + ["0"] * 6
                        )[:6]

                        daily_payout = payouts[0]
                        weekly_payout = payouts[1]
                        weekly7_payout = payouts[2]
                        monthly30_payout = payouts[3]
                        monthly45_payout = payouts[4]
                        monthly60_payout = payouts[5]

                    # =====================================
                    # MAX DURATION
                    # =====================================

                    max_duration = (
                        get_column(
                            row,
                            "max_duration",
                            "Max Duration",
                        )
                        or "0"
                    )

                    # =====================================
                    # INFO
                    # =====================================

                    info = (
                        get_column(
                            row,
                            "info",
                            "Info",
                        )
                        or ""
                    ).strip()

                    # =====================================
                    # BUILD DATA
                    # =====================================

                    data = {

                        "carrier": carrier,

                        "name": name,

                        "prefix": prefix,

                        "currency": currency,

                        "payment_term": payment_term,

                        "carrier_payout":
                            TerminationService._decimal(
                                carrier_payout
                            ),

                        "daily_payout":
                            TerminationService._decimal(
                                daily_payout
                            ),

                        "weekly_payout":
                            TerminationService._decimal(
                                weekly_payout
                            ),

                        "weekly7_payout":
                            TerminationService._decimal(
                                weekly7_payout
                            ),

                        "monthly30_payout":
                            TerminationService._decimal(
                                monthly30_payout
                            ),

                        "monthly45_payout":
                            TerminationService._decimal(
                                monthly45_payout
                            ),

                        "monthly60_payout":
                            TerminationService._decimal(
                                monthly60_payout
                            ),

                        "max_duration":
                            TerminationService._integer(
                                max_duration
                            ),

                        "info": info,

                        "created_by": user,
                    }

                    # =====================================
                    # CREATE / UPDATE
                    # =====================================

                    termination, was_created = (
                        Termination.objects.update_or_create(

                            carrier=carrier,

                            name=name,

                            defaults=data,

                        )
                    )

                    if was_created:

                        created += 1

                    else:

                        updated += 1

                except Exception as exc:

                    failed += 1

                    errors.append(
                        {
                            "row": row_number,

                            "name": (
                                get_column(
                                    row,
                                    "name",
                                    "Name",
                                )
                                or ""
                            ).strip(),

                            "error": str(exc),
                        }
                    )

        # =================================================
        # FINAL RESULT
        # =================================================

        return {

            "carrier": carrier.name,

            "created": created,

            "updated": updated,

            "failed": failed,

            "total": (
                created
                + updated
                + failed
            ),

            "errors": errors,
        }