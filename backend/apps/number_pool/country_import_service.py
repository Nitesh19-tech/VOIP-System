import pandas as pd

from .models import Country


class CountryImportService:

    @staticmethod
    def import_file(file, user):

        imported = 0
        duplicates = 0
        failed = 0

        ext = file.name.lower().split(".")[-1]

        if ext == "csv":
            df = pd.read_csv(file)

        elif ext in ["xlsx", "xls"]:
            df = pd.read_excel(file)

        else:
            raise Exception(
                "Only CSV and Excel files are supported."
            )

        # Normalize column names
        df.columns = [
            str(col).strip().lower()
            for col in df.columns
        ]

        # Required columns
        required_columns = [
            "iso code",
            "code",
            "country",
        ]

        for col in required_columns:
            if col not in df.columns:
                raise Exception(
                    f"Column '{col}' not found."
                )

        countries = []

        for _, row in df.iterrows():

            try:

                iso_code = str(
                    row["iso code"]
                ).strip().upper()

                dial_code = str(
                    row["code"]
                ).strip()

                name = str(
                    row["country"]
                ).strip()

                # Skip empty rows
                if (
                    not iso_code
                    or not dial_code
                    or not name
                ):
                    failed += 1
                    continue

                # Skip duplicate ISO or Dial Code
                if Country.objects.filter(
                    iso_code=iso_code
                ).exists():

                    duplicates += 1
                    continue

                if Country.objects.filter(
                    dial_code=dial_code
                ).exists():

                    duplicates += 1
                    continue

                countries.append(

                    Country(

                        name=name,

                        iso_code=iso_code,

                        dial_code=dial_code,

                        created_by=user,

                    )

                )

                imported += 1

            except Exception as e:

                print(e)

                failed += 1

        Country.objects.bulk_create(
            countries,
            batch_size=500,
        )

        return {

            "total_rows": len(df),

            "imported": imported,

            "duplicates": duplicates,

            "failed": failed,

        }