from django.shortcuts import get_object_or_404
from django.db.models import Q

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
    def delete(country):

        country.delete()


class NumberPoolService:

    @staticmethod
    def create_number(data, user):

        # Company Admin -> auto assign
        if user.role == COMPANY_ADMIN:
            data["admin"] = user

        # Super Admin -> selected admin
        elif user.role == SUPER_ADMIN:
            data["admin"] = data.get("admin")

        # Auto Status
        if data.get("client"):
            data["status"] = "ASSIGNED"
        else:
            data["status"] = "AVAILABLE"

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
        status = filters.get("status")
        provider = filters.get("provider")
        client = filters.get("client")

        if search:
            queryset = queryset.filter(
                Q(did_number__icontains=search)
                | Q(extension__icontains=search)
                | Q(country__name__icontains=search)
                | Q(provider__icontains=search)
            )

        if country:
            queryset = queryset.filter(country_id=country)

        if status:
            queryset = queryset.filter(status=status)

        if provider:
            queryset = queryset.filter(
                provider__icontains=provider
            )

        if client:
            queryset = queryset.filter(client_id=client)

        return queryset.order_by("did_number")

    @staticmethod
    def get_by_id(pk, user):

        queryset = NumberPool.objects.select_related(
            "admin",
            "client",
            "country",
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

        # Company Admin owner change nahi kar sakta
        if user.role == COMPANY_ADMIN:
            data.pop("admin", None)

        # Auto Status
        if "client" in data:

            if data["client"]:
                data["status"] = "ASSIGNED"
            else:
                data["status"] = "AVAILABLE"

        for key, value in data.items():
            setattr(number, key, value)

        number.save()

        return number

    @staticmethod
    def delete_number(number):

        number.delete()