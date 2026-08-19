import pandas as pd

from decimal import Decimal, InvalidOperation

import phonenumbers
from phonenumbers import (
    NumberParseException,
    region_code_for_number,
)

from apps.accounts.constants import COMPANY_ADMIN

from .models import Country, NumberPool
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
    # FIND COUNTRY FROM PHONE NUMBER
    # =====================================================

    @staticmethod
    def detect_country_from_number(
        number,
        countries,
    ):
        """
        Detect country using Google's libphonenumber
        metadata.

        Examples:

        +12424221547 -> BS -> Bahamas
        +919876543210 -> IN -> India
        +447911123456 -> GB -> United Kingdom
        """

        digits = (
            NumberPoolImportService
            .normalize_number(number)
        )

        if not digits:
            return None


        possible_numbers = []


        # -------------------------------------------------
        # INTERNATIONAL NUMBER
        # -------------------------------------------------

        possible_numbers.append(
            f"+{digits}"
        )


        # -------------------------------------------------
        # 10 DIGIT NANP NUMBER
        # -------------------------------------------------

        if len(digits) == 10:

            possible_numbers.append(
                f"+1{digits}"
            )


        # -------------------------------------------------
        # TRY ALL POSSIBILITIES
        # -------------------------------------------------

        for candidate in possible_numbers:

            try:

                parsed = (
                    phonenumbers.parse(
                        candidate,
                        None,
                    )
                )

                if not phonenumbers.is_possible_number(
                    parsed
                ):
                    continue


                if not phonenumbers.is_valid_number(
                    parsed
                ):
                    continue


                region = (
                    region_code_for_number(
                        parsed
                    )
                )


                if not region:
                    continue


                region = region.upper()


                # -----------------------------------------
                # FIND COUNTRY BY ISO
                # -----------------------------------------

                country = countries.get(
                    region
                )


                if country:

                    return country


            except NumberParseException:

                continue

            except Exception as e:

                print(
                    "Country Detection Error:",
                    e,
                )

                continue


        return None


    # =====================================================
    # FIND COUNTRY FROM CSV NAME
    # =====================================================

    @staticmethod
    def detect_country_from_name(
        value,
        countries_by_name,
    ):

        value = (
            NumberPoolImportService.clean_value(
                value
            )
        )

        if not value:
            return None


        value_lower = value.lower()


        # Exact match
        country = countries_by_name.get(
            value_lower
        )

        if country:
            return country


        # Some common variations
        aliases = {

            "usa": "US",
            "us": "US",
            "united states of america": "US",

            "uk": "GB",
            "great britain": "GB",
            "england": "GB",

            "uae": "AE",
            "united arab emirates": "AE",

            "russia": "RU",

            "south korea": "KR",
            "republic of korea": "KR",

            "czech republic": "CZ",

        }


        iso_code = aliases.get(
            value_lower
        )


        if iso_code:

            return iso_code


        return None


    # =====================================================
    # FIND COUNTRY FROM RANGE NAME
    # =====================================================

    @staticmethod
    def detect_country_from_range(
        range_name,
        countries_by_name,
    ):

        range_name = (
            NumberPoolImportService.clean_value(
                range_name
            )
        )

        if not range_name:
            return None


        range_lower = range_name.lower()


        # Exact match first

        country = countries_by_name.get(
            range_lower
        )

        if country:

            return country


        # Partial match

        for (
            country_name,
            country,
        ) in countries_by_name.items():

            if country_name in range_lower:

                return country


        return None


    # =====================================================
    # IMPORT HELPERS
    # =====================================================

    @staticmethod
    def _resolve_fk(value, model):
        """Resolve FK from instance, primary key, or name."""
        if value in (None, ""):
            return None

        if isinstance(value, model):
            return value

        value = NumberPoolImportService.clean_value(value)

        if not value:
            return None

        try:
            return model.objects.get(pk=int(value))
        except (ValueError, TypeError, model.DoesNotExist):
            pass

        try:
            return model.objects.filter(name__iexact=value).first()
        except Exception:
            return None

    @staticmethod
    def _normalize_service_variables(value):
        """Keep service variables JSON serializable."""
        if value in (None, ""):
            return {}

        if isinstance(value, dict):
            return value

        if isinstance(value, str):
            value = value.strip()

            if not value:
                return {}

            try:
                import json

                parsed = json.loads(value)

                if isinstance(parsed, dict):
                    return parsed

            except Exception:
                pass

            return {"value": value}

        return {"value": str(value)}

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

        carrier_obj = NumberPoolImportService._resolve_fk(
            carrier,
            Carrier,
        )

        termination_obj = NumberPoolImportService._resolve_fk(
            termination,
            Termination,
        )

        client_obj = None

        if client not in (None, ""):
            try:
                from apps.clients.models import Client

                client_obj = (
                    NumberPoolImportService._resolve_fk(
                        client,
                        Client,
                    )
                )
            except Exception:
                client_obj = None

        try:
            max_calls_value = int(max_calls or 0)
        except (ValueError, TypeError):
            max_calls_value = 0

        try:
            max_duration_value = int(max_duration or 0)
        except (ValueError, TypeError):
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
        # COUNTRY COLUMN
        # =================================================

        country_column = next(
            (
                column
                for column in [
                    "country",
                    "country_name",
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
                    or column.startswith("payterm(")
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
        # COUNTRIES
        # =================================================

        country_objects = list(
            Country.objects.all()
        )

        countries_by_name = {
            country.name.strip().lower(): country
            for country in country_objects
        }

        countries_by_iso = {
            country.iso_code.strip().upper(): country
            for country in country_objects
            if country.iso_code
        }

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
                # COUNTRY DETECTION
                # =================================================

                country = None

                if country_column:

                    country_name = (
                        NumberPoolImportService
                        .clean_value(
                            row[country_column]
                        )
                    )

                    if country_name:

                        result = (
                            NumberPoolImportService
                            .detect_country_from_name(
                                country_name,
                                countries_by_name,
                            )
                        )

                        if isinstance(
                            result,
                            Country,
                        ):

                            country = result

                        elif result:

                            country = (
                                countries_by_iso
                                .get(result)
                            )

                if (
                    country is None
                    and range_name
                ):

                    country = (
                        NumberPoolImportService
                        .detect_country_from_range(
                            range_name,
                            countries_by_name,
                        )
                    )

                if country is None:

                    country = (
                        NumberPoolImportService
                        .detect_country_from_number(
                            number,
                            countries_by_iso,
                        )
                    )

                if country is None:

                    print(
                        "COUNTRY NOT DETECTED:",
                        number,
                        "| RANGE:",
                        range_name,
                    )

                    invalid += 1
                    continue

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
                        if carrier_obj and termination_obj
                        else "AVAILABLE"
                    ),

                    description=description,

                    country=country,

                    carrier=carrier_obj,

                    termination=termination_obj,

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
                        .clean_value(service_id)
                    ),

                    service_variables=(
                        service_variables_value
                    ),

                    is_test_number=is_current_test,

                    created_by=user,
                )

                if user.role == COMPANY_ADMIN:

                    obj.admin = user

                if carrier_obj and termination_obj:

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