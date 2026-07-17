from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, ProtectedError

from apps.accounts.constants import (
    SUPER_ADMIN,
    COMPANY_ADMIN,
)

from .models import (
    NumberPool,
    Country,
)


class CountryService:

    @staticmethod
    def create(data, user):

        return Country.objects.create(
            created_by=user,
            **data,
        )

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

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            Country,
            pk=pk,
        )

    @staticmethod
    def update(country, data):

        for key, value in data.items():
            setattr(country, key, value)

        country.save()

        return country

    @staticmethod
    def delete_number(number):

        if number.status == "ASSIGNED":
            raise ValueError(
                "Assigned numbers cannot be deleted. Please unassign the number first."
            )

        if number.status == "RESERVED":
            raise ValueError(
                "Reserved numbers cannot be deleted. Please release the reservation first."
            )

        try:
            number.delete()

        except ProtectedError:
            raise ValueError(
                "This number is linked with other records and cannot be deleted."
            )


class NumberPoolService:

    @staticmethod
    def create_number(data, user):

        if user.role == COMPANY_ADMIN:
            data["admin"] = user

        elif user.role == SUPER_ADMIN:
            data["admin"] = data.get("admin")

        if data.get("client"):
            data["status"] = "ASSIGNED"
            data["assigned_at"] = timezone.now()
        else:
            data["status"] = "AVAILABLE"
            data["assigned_at"] = None

        return NumberPool.objects.create(
            created_by=user,
            **data,
        )

    @staticmethod
    def get_all(user, filters=None):

        queryset = NumberPool.objects.select_related(
            "admin",
            "client",
            "country",
            "carrier",
            "termination",
        )

        if user.role == SUPER_ADMIN:
            pass

        elif user.role == COMPANY_ADMIN:
            queryset = queryset.filter(admin=user)

        else:
            return NumberPool.objects.none()

        if not filters:
            return queryset.order_by("did_number")

        search = filters.get("search")
        country = filters.get("country")
        carrier = filters.get("carrier")
        termination = filters.get("termination")
        status = filters.get("status")
        client = filters.get("client")

        if search:
            queryset = queryset.filter(
                Q(did_number__icontains=search)
                | Q(extension__icontains=search)
                | Q(country__name__icontains=search)
                | Q(carrier__name__icontains=search)
                | Q(termination__name__icontains=search)
            )

        if country:
            queryset = queryset.filter(country_id=country)

        if carrier:
            queryset = queryset.filter(carrier_id=carrier)

        if termination:
            queryset = queryset.filter(termination_id=termination)

        if status:
            queryset = queryset.filter(status=status)

        if client:
            queryset = queryset.filter(client_id=client)

        return queryset.order_by("did_number")

    @staticmethod
    def get_by_id(pk, user):

        queryset = NumberPool.objects.select_related(
            "admin",
            "client",
            "country",
            "carrier",
            "termination",
        )

        if user.role == SUPER_ADMIN:
            return get_object_or_404(
                queryset,
                pk=pk,
            )

        return get_object_or_404(
            queryset,
            pk=pk,
            admin=user,
        )

    @staticmethod
    def update_number(number, data, user):

        if user.role == COMPANY_ADMIN:
            data.pop("admin", None)

        if "client" in data:

            if data["client"]:
                data["status"] = "ASSIGNED"
                data["assigned_at"] = timezone.now()
            else:
                data["status"] = "AVAILABLE"
                data["assigned_at"] = None

        for key, value in data.items():
            setattr(number, key, value)

        number.save()

        return number

    @staticmethod
    def delete_number(number):

        number.delete()

    @staticmethod
    @transaction.atomic
    def bulk_allocate(data, user):

        carrier = data["carrier"]
        termination = data["termination"]
        client = data["client"]
        quantity = data["quantity"]

        queryset = NumberPool.objects.filter(
            carrier=carrier,
            termination=termination,
            status="AVAILABLE",
            client__isnull=True,
        ).order_by("id")

        numbers = list(queryset[:quantity])

        if not numbers:
            raise ValueError(
                "No available numbers found."
            )

        now = timezone.now()

        for number in numbers:
            number.client = client
            number.status = "ASSIGNED"
            number.assigned_at = now

        NumberPool.objects.bulk_update(
            numbers,
            [
                "client",
                "status",
                "assigned_at",
            ],
        )

        return len(numbers)