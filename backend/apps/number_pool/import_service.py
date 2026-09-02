import re
import pandas as pd

from decimal import Decimal, InvalidOperation

from django.db import transaction

from apps.accounts.constants import COMPANY_ADMIN
from apps.asterisk.asterisk_service import AsteriskService

from .models import NumberPool
from apps.carriers.models import Carrier, Termination


class NumberPoolImportService:

    # =====================================================
    # HELPERS
    # =====================================================

    @staticmethod
    def clean_value(value):

        if value is None:
            return ""

        value = str(value).strip()

        if value.lower() in (
            "",
            "nan",
            "none",
            "null",
        ):
            return ""

        # Remove Excel float representation
        # Example: 919876543210.0
        if value.endswith(".0"):

            try:
                value = value[:-2]

            except Exception:
                pass

        return value

    # =====================================================
    # DECIMAL
    # =====================================================

    @staticmethod
    def decimal_value(
        value,
        default="0",
    ):

        value = (
            NumberPoolImportService.clean_value(
                value
            )
        )

        if not value:
            return Decimal(default)

        try:

            return Decimal(value)

        except (
            InvalidOperation,
            ValueError,
        ):

            return Decimal(default)

    # =====================================================
    # INTEGER
    # =====================================================

    @staticmethod
    def integer_value(
        value,
        default=30,
    ):

        value = (
            NumberPoolImportService.clean_value(
                value
            )
        )

        if not value:
            return default

        try:

            return int(float(value))

        except (
            ValueError,
            TypeError,
        ):

            return default

    # =====================================================
    # NORMALIZE NUMBER
    # =====================================================

    @staticmethod
    def normalize_number(value):

        value = (
            NumberPoolImportService.clean_value(
                value
            )
        )

        if not value:
            return ""

        # Keep digits only
        digits = "".join(
            char
            for char in value
            if char.isdigit()
        )

        return digits

    # =====================================================
    # IMPORT HELPERS
    # =====================================================

    @staticmethod
    def _resolve_fk(
        value,
        model,
    ):
        """Resolve FK from instance, primary key, or name."""

        if value in (
            None,
            "",
        ):
            return None

        if isinstance(
            value,
            model,
        ):
            return value

        value = (
            NumberPoolImportService.clean_value(
                value
            )
        )

        if not value:
            return None

        try:

            return model.objects.get(
                pk=int(value)
            )

        except (
            ValueError,
            TypeError,
            model.DoesNotExist,
        ):
            pass

        try:

            return (
                model.objects
                .filter(
                    name__iexact=value
                )
                .first()
            )

        except Exception:

            return None

    @staticmethod
    def _normalize_service_variables(
        value,
    ):
        """Keep service variables JSON serializable."""

        if value in (
            None,
            "",
        ):
            return {}

        if isinstance(
            value,
            dict,
        ):
            return value

        if isinstance(
            value,
            str,
        ):

            value = value.strip()

            if not value:
                return {}

            try:

                import json

                parsed = json.loads(
                    value
                )

                if isinstance(
                    parsed,
                    dict,
                ):
                    return parsed

            except Exception:
                pass

            return {
                "value": value
            }

        return {
            "value": str(value)
        }

    # =====================================================
    # AUTO RESOLVE TERMINATION FROM RANGE NAME
    # =====================================================
    @staticmethod
    def resolve_termination_from_range(
        range_name,
        carrier_obj=None,
        termination_queryset=None,
    ):
        """
        CSV has no Termination column.
        Example:
            AFGHANISTAN - MOBILE ROSHAN-ING2.18

        Resolve the NumberPool termination from Range_Name.
        Matching order:
          1. exact normalized termination name
          2. normalized Range_Name contained in termination name
          3. final ING2.x suffix, only when it gives one
             unambiguous termination for the selected carrier.
        """
        value = NumberPoolImportService.clean_value(range_name)
        if not value:
            return None

        def normalize(value):
            value = NumberPoolImportService.clean_value(value).upper()
            value = re.sub(r"[^A-Z0-9]+", " ", value)
            return " ".join(value.split())

        normalized_range = normalize(value)
        if not normalized_range:
            return None

        # Accept a preloaded list/queryset. The importer processes thousands
        # of rows, so do not hit the database once per row.
        if isinstance(termination_queryset, (list, tuple)):
            terminations = list(termination_queryset)
        else:
            qs = termination_queryset
            if qs is None:
                qs = Termination.objects.all()

            if carrier_obj is not None:
                qs = qs.filter(carrier_id=carrier_obj.id)

            terminations = list(qs.only("id", "name", "carrier_id"))

        # 1. Exact normalized name.
        exact = [
            obj for obj in terminations
            if normalize(obj.name) == normalized_range
        ]
        if len(exact) == 1:
            return exact[0]

        # 2. Match Range_Name against termination name.
        contains = [
            obj for obj in terminations
            if normalized_range in normalize(obj.name)
            or normalize(obj.name) in normalized_range
        ]
        if len(contains) == 1:
            return contains[0]

        # 3. Use ING2.x suffix only if unique.
        suffix_match = re.search(
            r"\b(ING2(?:\.\d+)?)\s*$",
            value,
            flags=re.IGNORECASE,
        )
        if suffix_match:
            suffix = suffix_match.group(1).upper()
            suffix_candidates = [
                obj for obj in terminations
                if suffix in normalize(obj.name).replace(" ", "")
            ]
            if len(suffix_candidates) == 1:
                return suffix_candidates[0]

        return None

    # =====================================================
    # ASTERISK SYNC
    # =====================================================

    @staticmethod
    def sync_asterisk_inbound():

        try:

            print(
                "Starting Asterisk inbound sync after bulk import..."
            )

            AsteriskService.upload_inbound()

            AsteriskService.reload_dialplan()

            print(
                "Asterisk inbound sync completed successfully."
            )

        except Exception as e:

            print(
                f"Asterisk inbound provisioning failed: {e}"
            )

    # =====================================================
    # IMPORT
    # =====================================================

    @staticmethod
    def import_file(
        file,
        user,
        carrier=None,
        termination=None,
        client=None,
        service_id=None,
        service_variables=None,
        max_calls=0,
        max_duration=0,
        make_test_number=False,
    ):

        imported = 0
        duplicates = 0
        invalid = 0

        # =================================================
        # IMPORT OPTIONS
        # =================================================

        carrier_obj = (
            NumberPoolImportService._resolve_fk(
                carrier,
                Carrier,
            )
        )

        termination_obj = (
            NumberPoolImportService._resolve_fk(
                termination,
                Termination,
            )
        )

        client_obj = None

        if client not in (
            None,
            "",
        ):

            try:

                from apps.clients.models import Client

                client_obj = (
                    NumberPoolImportService
                    ._resolve_fk(
                        client,
                        Client,
                    )
                )

            except Exception:

                client_obj = None

        try:

            max_calls_value = int(
                max_calls or 0
            )

        except (
            ValueError,
            TypeError,
        ):

            max_calls_value = 0

        try:

            max_duration_value = int(
                max_duration or 0
            )

        except (
            ValueError,
            TypeError,
        ):

            max_duration_value = 0

        service_variables_value = (
            NumberPoolImportService
            ._normalize_service_variables(
                service_variables
            )
        )

        test_number_created = False

        # =================================================
        # READ FILE
        # =================================================

        ext = (
            file.name
            .lower()
            .split(".")[-1]
        )

        if ext == "csv":

            df = pd.read_csv(
                file,
                dtype=str,
                keep_default_na=False,
            )

        elif ext in (
            "xlsx",
            "xls",
        ):

            df = pd.read_excel(
                file,
                dtype=str,
            )

        else:

            raise Exception(
                "Only CSV and Excel files are supported."
            )

        # =================================================
        # NORMALIZE HEADERS
        # =================================================

        df.columns = [
            str(column)
            .strip()
            .lower()
            for column in df.columns
        ]

        # =================================================
        # TERMINATION COLUMN
        # =================================================
        # Supported names (case-insensitive because headers are
        # normalized to lowercase below):
        #   Termination / termination
        #   termination_name
        #   termination_id
        # =================================================

        termination_column = next(
            (
                column
                for column in [
                    "termination",
                    "termination_name",
                    "termination_id",
                    "terminationid",
                ]
                if column in df.columns
            ),
            None,
        )

        # =================================================
        # NUMBER COLUMN
        # =================================================

        number_column = next(
            (
                column
                for column in [
                    "number",
                    "did_number",
                    "did",
                    "phone_number",
                    "phone",
                ]
                if column in df.columns
            ),
            None,
        )

        if number_column is None:

            raise Exception(
                "Number column not found."
            )

        # =================================================
        # RANGE NAME
        # =================================================

        range_name_column = next(
            (
                column
                for column in [
                    "range_name",
                    "range name",
                ]
                if column in df.columns
            ),
            None,
        )

        # =================================================
        # PAYTERM
        # =================================================

        payterm_column = next(
            (
                column
                for column in df.columns
                if (
                    column == "payterm"
                    or column.startswith(
                        "payterm("
                    )
                )
            ),
            None,
        )

        # =================================================
        # EXISTING NUMBERS
        # =================================================

        existing_numbers = set(
            NumberPool.objects.values_list(
                "did_number",
                flat=True,
            )
        )

        existing_new_numbers = set(
            NumberPool.objects.values_list(
                "number",
                flat=True,
            )
        )

        # =================================================
        # PRELOAD TERMINATIONS
        # =================================================
        # Range_Name -> Termination is resolved for every imported row.
        # Load the carrier's terminations once instead of querying the DB
        # for every row.
        termination_candidates = list(
            (
                Termination.objects.filter(
                    carrier_id=carrier_obj.id
                )
                if carrier_obj
                else Termination.objects.all()
            ).only("id", "name", "carrier_id")
        )

        termination_cache = {}

        # =================================================
        # TRACKING
        # =================================================

        used_numbers = set()
        objects = []

        # =================================================
        # PROCESS ROWS
        # =================================================

        for _, row in df.iterrows():

            try:

                raw_number = (
                    NumberPoolImportService
                    .clean_value(
                        row[number_column]
                    )
                )

                if not raw_number:

                    invalid += 1
                    continue

                number = (
                    NumberPoolImportService
                    .normalize_number(
                        raw_number
                    )
                )

                if not number:

                    invalid += 1
                    continue

                # -----------------------------------------
                # DUPLICATE
                # -----------------------------------------

                if (
                    number in existing_numbers
                    or number in existing_new_numbers
                    or number in used_numbers
                ):

                    duplicates += 1
                    continue

                # -----------------------------------------
                # RANGE NAME
                # -----------------------------------------

                range_name = ""

                if range_name_column:

                    range_name = (
                        NumberPoolImportService
                        .clean_value(
                            row[range_name_column]
                        )
                    )

                # =================================================
                # ROW TERMINATION
                # =================================================
                # If CSV contains a Termination column, use it.
                # Otherwise automatically resolve it from Range_Name.
                # =================================================

                row_termination = termination_obj

                if termination_column:
                    termination_value = (
                        NumberPoolImportService.clean_value(
                            row[termination_column]
                        )
                    )

                    if termination_value:
                        row_termination = (
                            NumberPoolImportService._resolve_fk(
                                termination_value,
                                Termination,
                            )
                        )

                        if not row_termination:
                            raise ValueError(
                                f"Termination not found: {termination_value}"
                            )

                elif range_name:
                    # Cache Range_Name -> Termination so repeated ranges
                    # (e.g. many numbers under ANGUILLA-ING2.18) are
                    # resolved only once.
                    cache_key = range_name.strip().upper()
                    if cache_key not in termination_cache:
                        termination_cache[cache_key] = (
                            NumberPoolImportService
                            .resolve_termination_from_range(
                                range_name,
                                carrier_obj=carrier_obj,
                                termination_queryset=termination_candidates,
                            )
                        )

                    row_termination = termination_cache[cache_key]

                    if not row_termination:
                        raise ValueError(
                            f"Termination not found for Range_Name: "
                            f"{range_name}"
                        )

                # =================================================
                # CARRIER / TERMINATION RESOLUTION
                # =================================================
                # CSV termination is authoritative when supplied.
                # If no carrier was selected in the UI, derive the
                # carrier automatically from the selected termination.

                row_carrier = carrier_obj

                if row_termination:
                    termination_carrier = row_termination.carrier

                    if row_carrier:
                        if row_termination.carrier_id != row_carrier.id:
                            raise ValueError(
                                f"Termination '{row_termination.name}' does not "
                                f"belong to carrier '{row_carrier.name}'."
                            )
                    else:
                        row_carrier = termination_carrier

                # =================================================
                # CSV FINANCIAL DATA
                # =================================================

                qty = (
                    NumberPoolImportService
                    .decimal_value(
                        row["qty"]
                        if "qty" in df.columns
                        else ""
                    )
                )

                currency = ""

                if "currency" in df.columns:

                    currency = (
                        NumberPoolImportService
                        .clean_value(
                            row["currency"]
                        )
                    )

                payterm = 30

                if payterm_column:

                    payterm = (
                        NumberPoolImportService
                        .integer_value(
                            row[payterm_column],
                            default=30,
                        )
                    )

                payout = (
                    NumberPoolImportService
                    .decimal_value(
                        row["payout"]
                        if "payout" in df.columns
                        else ""
                    )
                )

                daily = (
                    NumberPoolImportService
                    .decimal_value(
                        row["daily"]
                        if "daily" in df.columns
                        else ""
                    )
                )

                weekly = (
                    NumberPoolImportService
                    .decimal_value(
                        row["weekly"]
                        if "weekly" in df.columns
                        else ""
                    )
                )

                weekly7 = (
                    NumberPoolImportService
                    .decimal_value(
                        row["weekly7"]
                        if "weekly7" in df.columns
                        else ""
                    )
                )

                monthly30 = (
                    NumberPoolImportService
                    .decimal_value(
                        row["monthly30"]
                        if "monthly30" in df.columns
                        else ""
                    )
                )

                monthly45 = (
                    NumberPoolImportService
                    .decimal_value(
                        row["monthly45"]
                        if "monthly45" in df.columns
                        else ""
                    )
                )

                monthly60 = (
                    NumberPoolImportService
                    .decimal_value(
                        row["monthly60"]
                        if "monthly60" in df.columns
                        else ""
                    )
                )

                prefix = ""

                if "prefix" in df.columns:

                    prefix = (
                        NumberPoolImportService
                        .clean_value(
                            row["prefix"]
                        )
                    )

                description = ""

                if "description" in df.columns:

                    description = (
                        NumberPoolImportService
                        .clean_value(
                            row["description"]
                        )
                    )

                # =================================================
                # EXACTLY ONE TEST NUMBER
                # =================================================

                is_current_test = (
                    bool(make_test_number)
                    and not test_number_created
                )

                if is_current_test:
                    test_number_created = True

                # =================================================
                # CREATE OBJECT
                # =================================================

                obj = NumberPool(

                    did_number=number,

                    number=number,

                    range_name=range_name,

                    qty=qty,

                    currency=currency,

                    payterm=payterm,

                    payout=payout,

                    daily=daily,

                    weekly=weekly,

                    weekly7=weekly7,

                    monthly30=monthly30,

                    monthly45=monthly45,

                    monthly60=monthly60,

                    prefix=prefix,

                    status=(
                        "ASSIGNED"
                        if row_carrier and row_termination
                        else "AVAILABLE"
                    ),

                    description=description,

                    carrier=row_carrier,

                    termination=row_termination,

                    client=client_obj,

                    number_type=(
                        "TEST"
                        if is_current_test
                        else "GENERAL"
                    ),

                    number_mode="CSV",

                    total_numbers=1,

                    daily_max_call=max_calls_value,

                    daily_max_duration=max_duration_value,

                    number_service=(
                        NumberPoolImportService
                        .clean_value(
                            service_id
                        )
                    ),

                    service_variables=(
                        service_variables_value
                    ),

                    is_test_number=is_current_test,

                    created_by=user,
                )

                if user.role == COMPANY_ADMIN:

                    obj.admin = user

                if row_carrier and row_termination:

                    from django.utils import timezone

                    obj.assigned_at = timezone.now()

                objects.append(obj)

                used_numbers.add(number)

                imported += 1

            except Exception as e:

                print(
                    f"IMPORT ROW ERROR: {e}"
                )

                invalid += 1

        # =================================================
        # BULK CREATE
        # =================================================

        if objects:

            NumberPool.objects.bulk_create(
                objects,
                batch_size=1000,
            )

            # -------------------------------------------------
            # IMPORTANT:
            # bulk_create() does NOT execute the normal
            # NumberPool save/create hooks.
            #
            # Therefore explicitly sync Asterisk after
            # successful database commit.
            # -------------------------------------------------

            transaction.on_commit(
                NumberPoolImportService
                .sync_asterisk_inbound
            )

        # =================================================
        # RESULT
        # =================================================

        return {

            "total_rows": len(df),

            "imported": imported,

            "duplicates": duplicates,

            "invalid": invalid,

            "carrier_id": (
                carrier_obj.id
                if carrier_obj
                else None
            ),

            "termination_id": (
                termination_obj.id
                if termination_obj
                else None
            ),

            "client_id": (
                client_obj.id
                if client_obj
                else None
            ),

            "service_id": service_id,

            "max_calls": max_calls_value,

            "max_duration": max_duration_value,

            "make_test_number": bool(
                make_test_number
            ),

            "test_number_created": (
                test_number_created
            ),

        }