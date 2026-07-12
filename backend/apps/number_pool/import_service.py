import pandas as pd

from apps.accounts.constants import COMPANY_ADMIN

from .models import Country, NumberPool


class NumberPoolImportService:

    @staticmethod
    def import_file(file, user):

        imported = 0
        duplicates = 0
        invalid = 0

        ext = file.name.lower().split(".")[-1]

        if ext == "csv":
            df = pd.read_csv(file)

        elif ext in ["xlsx", "xls"]:
            df = pd.read_excel(file)

        else:
            raise Exception(
                "Only CSV and Excel files are supported."
            )

        # Normalize headers
        df.columns = [
            str(col).strip().lower()
            for col in df.columns
        ]

        # -------------------------
        # Detect Country Column
        # -------------------------

        country_column = next(
            (
                c
                for c in [
                    "country",
                    "country_name",
                ]
                if c in df.columns
            ),
            None,
        )

        if country_column is None:
            raise Exception("Country column not found.")

        # -------------------------
        # Detect Number Column
        # -------------------------

        number_column = next(
            (
                c
                for c in [
                    "did_number",
                    "did",
                    "number",
                    "phone_number",
                    "phone",
                ]
                if c in df.columns
            ),
            None,
        )

        if number_column is None:
            raise Exception("Number column not found.")

        # -------------------------
        # Detect Extension Column
        # -------------------------

        extension_column = next(
            (
                c
                for c in [
                    "extension",
                    "ext",
                ]
                if c in df.columns
            ),
            None,
        )

        # Existing DB Data
        existing_numbers = set(
            NumberPool.objects.values_list(
                "did_number",
                flat=True,
            )
        )

        existing_extensions = set(
            NumberPool.objects.values_list(
                "extension",
                flat=True,
            )
        )

        # Existing Countries
        countries = {
            c.name.lower(): c
            for c in Country.objects.all()
        }

        # Current Import
        used_numbers = set()
        used_extensions = set()

        objects = []

        for _, row in df.iterrows():

            try:

                country_name = str(
                    row[country_column]
                ).strip()

                did_number = str(
                    row[number_column]
                ).strip()

                if (
                    did_number == ""
                    or did_number.lower() == "nan"
                ):
                    invalid += 1
                    continue

                country = countries.get(
                    country_name.lower()
                )

                if not country:
                    invalid += 1
                    continue

                # Duplicate DID
                if (
                    did_number in existing_numbers
                    or did_number in used_numbers
                ):
                    duplicates += 1
                    continue

                # Extension
                extension = ""

                if extension_column:
                    extension = str(
                        row[extension_column]
                    ).strip()

                if (
                    extension == ""
                    or extension.lower() == "nan"
                ):

                    digits = "".join(
                        filter(str.isdigit, did_number)
                    )

                    base = (
                        digits[-4:]
                        if len(digits) >= 4
                        else digits
                    )

                    extension = base

                    counter = 1

                    while (
                        extension in existing_extensions
                        or extension in used_extensions
                    ):
                        extension = (
                            f"{base}{counter}"
                        )
                        counter += 1

                else:

                    while (
                        extension in existing_extensions
                        or extension in used_extensions
                    ):
                        extension = (
                            str(int(extension) + 1)
                        )

                description = ""

                if "description" in df.columns:
                    description = str(
                        row["description"]
                    ).strip()

                provider = ""

                if "provider" in df.columns:
                    provider = str(
                        row["provider"]
                    ).strip()

                obj = NumberPool(

                    country=country,

                    did_number=did_number,

                    extension=extension,

                    description=description,

                    provider=provider,

                    status="AVAILABLE",

                    created_by=user,

                )

                if user.role == COMPANY_ADMIN:
                    obj.admin = user

                objects.append(obj)

                used_numbers.add(did_number)
                used_extensions.add(extension)

                imported += 1

            except Exception as e:

                print(e)

                invalid += 1

        NumberPool.objects.bulk_create(
            objects,
            batch_size=1000,
        )

        return {

            "total_rows": len(df),

            "imported": imported,

            "duplicates": duplicates,

            "invalid": invalid,

        }