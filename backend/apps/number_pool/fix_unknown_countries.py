import phonenumbers

from phonenumbers import region_code_for_number

from apps.number_pool.models import NumberPool, Country


def run():

    print("=" * 60)
    print("STARTING UNKNOWN COUNTRY FIX")
    print("=" * 60)

    # -------------------------------------------------
    # COUNTRY MAP
    # -------------------------------------------------

    countries = {
        country.iso_code.upper(): country
        for country in Country.objects.all()
        if country.iso_code
    }

    print(
        "Countries available:",
        len(countries)
    )

    # -------------------------------------------------
    # UNKNOWN NUMBERS
    # -------------------------------------------------

    queryset = (
        NumberPool.objects
        .filter(country__name="Unknown")
        .only("id", "number", "country")
    )

    total = queryset.count()

    print(
        "Unknown numbers:",
        total
    )

    # -------------------------------------------------
    # COUNTERS
    # -------------------------------------------------

    updated = 0
    not_detected = 0
    no_country_record = 0
    errors = 0

    # -------------------------------------------------
    # PROCESS IN BATCHES
    # -------------------------------------------------

    batch = []

    batch_size = 1000

    for number_obj in queryset.iterator(
        chunk_size=1000
    ):

        number = str(
            number_obj.number or ""
        ).strip()

        if not number:
            not_detected += 1
            continue

        try:

            # -----------------------------------------
            # NORMALIZE
            # -----------------------------------------

            digits = "".join(
                char
                for char in number
                if char.isdigit()
            )

            if not digits:
                not_detected += 1
                continue

            # -----------------------------------------
            # PARSE
            # -----------------------------------------

            parsed = phonenumbers.parse(
                "+" + digits,
                None,
            )

            # -----------------------------------------
            # REGION
            # -----------------------------------------

            region = region_code_for_number(
                parsed
            )

            if not region:

                not_detected += 1
                continue

            region = region.upper()

            # -----------------------------------------
            # COUNTRY
            # -----------------------------------------

            country = countries.get(
                region
            )

            if not country:

                no_country_record += 1

                if no_country_record <= 20:

                    print(
                        "NO COUNTRY RECORD:",
                        digits,
                        "=>",
                        region
                    )

                continue

            # -----------------------------------------
            # UPDATE OBJECT
            # -----------------------------------------

            number_obj.country = country

            batch.append(
                number_obj
            )

            # -----------------------------------------
            # BULK UPDATE
            # -----------------------------------------

            if len(batch) >= batch_size:

                NumberPool.objects.bulk_update(
                    batch,
                    ["country"],
                    batch_size=batch_size,
                )

                updated += len(batch)

                print(
                    "Updated:",
                    updated,
                    "/",
                    total
                )

                batch.clear()

        except Exception as e:

            errors += 1

            if errors <= 20:

                print(
                    "ERROR:",
                    number,
                    "=>",
                    e
                )

    # -------------------------------------------------
    # FINAL BATCH
    # -------------------------------------------------

    if batch:

        NumberPool.objects.bulk_update(
            batch,
            ["country"],
            batch_size=batch_size,
        )

        updated += len(batch)

    # -------------------------------------------------
    # RESULT
    # -------------------------------------------------

    print()
    print("=" * 60)
    print("COUNTRY FIX COMPLETED")
    print("=" * 60)

    print(
        "TOTAL UNKNOWN:",
        total
    )

    print(
        "UPDATED:",
        updated
    )

    print(
        "NOT DETECTED:",
        not_detected
    )

    print(
        "NO COUNTRY RECORD:",
        no_country_record
    )

    print(
        "ERRORS:",
        errors
    )

    print("=" * 60)