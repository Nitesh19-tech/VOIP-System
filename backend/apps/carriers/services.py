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

        CSV fields:

        Name
            -> Termination.name

        Prefix
            -> Termination.prefix

        Currency
            -> Termination.currency

        Carrier Term
            -> Termination.payment_term

        Carrier Payout
            -> Termination.carrier_payout

        D|W|W7|M30|M45|M60
            -> daily_payout
            -> weekly_payout
            -> weekly7_payout
            -> monthly30_payout
            -> monthly45_payout
            -> monthly60_payout

        Max Duration
            -> Termination.max_duration

        Info
            -> Termination.info

        Active
            -> ignored

        Action
            -> ignored

        Unnamed: 0
            -> ignored

        Carrier
            -> fixed to saurabh1

        Existing records with the same
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

        reader = csv.DictReader(
            io.StringIO(raw)
        )

        fieldnames = reader.fieldnames or []

        # Remove BOM / spaces from headers
        fieldnames = [
            field.strip()
            if field
            else field
            for field in fieldnames
        ]

        reader.fieldnames = fieldnames

        # =================================================
        # REQUIRED COLUMNS
        # =================================================

        required_columns = [
            "Name",
            "Prefix",
            "Currency",
            "Carrier Term",
            "Carrier Payout",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in fieldnames
        ]

        # =================================================
        # PAYOUT COLUMN
        # =================================================

        payout_column = None

        for column in fieldnames:

            normalized = (
                column
                .replace(" ", "")
                .strip()
            )

            if normalized == (
                "D|W|W7|M30|M45|M60"
            ):

                payout_column = column

                break

        if not payout_column:

            missing_columns.append(
                "D|W|W7|M30|M45|M60"
            )

        if missing_columns:

            raise ValueError(
                "Missing CSV columns: "
                + ", ".join(
                    missing_columns
                )
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

                    # -------------------------------------
                    # NAME
                    # -------------------------------------

                    name = (
                        row.get("Name")
                        or ""
                    ).strip()

                    if not name:

                        raise ValueError(
                            "Name is empty"
                        )

                    # -------------------------------------
                    # PAYOUT VALUES
                    # -------------------------------------

                    payout_string = (
                        row.get(
                            payout_column
                        )
                        or ""
                    ).strip()

                    payouts = payout_string.split(
                        "|"
                    )

                    # Always keep six payout values

                    payouts = (
                        payouts
                        + ["0"] * 6
                    )[:6]

                    # -------------------------------------
                    # PAYMENT TERM
                    # -------------------------------------

                    payment_term = (
                        row.get(
                            "Carrier Term"
                        )
                        or ""
                    ).strip()

                    if not payment_term:

                        payment_term = (
                            "Monthly30"
                        )

                    valid_payment_terms = {
                        "Daily",
                        "Weekly",
                        "Weekly7",
                        "Monthly30",
                        "Monthly45",
                        "Monthly60",
                    }

                    if (
                        payment_term
                        not in valid_payment_terms
                    ):

                        raise ValueError(
                            "Invalid Carrier Term: "
                            f"{payment_term}"
                        )

                    # -------------------------------------
                    # BUILD DATA
                    # -------------------------------------

                    data = {

                        "carrier": carrier,

                        "name": name,

                        "prefix": (
                            row.get(
                                "Prefix"
                            )
                            or ""
                        ).strip(),

                        "currency": (
                            row.get(
                                "Currency"
                            )
                            or "USD"
                        ).strip() or "USD",

                        "payment_term": (
                            payment_term
                        ),

                        "carrier_payout":
                            TerminationService._decimal(
                                row.get(
                                    "Carrier Payout"
                                )
                            ),

                        "daily_payout":
                            TerminationService._decimal(
                                payouts[0]
                            ),

                        "weekly_payout":
                            TerminationService._decimal(
                                payouts[1]
                            ),

                        "weekly7_payout":
                            TerminationService._decimal(
                                payouts[2]
                            ),

                        "monthly30_payout":
                            TerminationService._decimal(
                                payouts[3]
                            ),

                        "monthly45_payout":
                            TerminationService._decimal(
                                payouts[4]
                            ),

                        "monthly60_payout":
                            TerminationService._decimal(
                                payouts[5]
                            ),

                        "max_duration":
                            TerminationService._integer(
                                row.get(
                                    "Max Duration"
                                )
                            ),

                        "info": (
                            row.get(
                                "Info"
                            )
                            or ""
                        ).strip(),

                        "created_by": user,
                    }

                    # -------------------------------------
                    # CREATE / UPDATE
                    # -------------------------------------

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
                                row.get(
                                    "Name"
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
            ),

            "errors": errors,
        }