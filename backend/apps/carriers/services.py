from django.shortcuts import get_object_or_404

from .models import (
    Carrier,
    CarrierIP,
)


class CarrierService:

    @staticmethod
    def get_all(user, params=None):

        queryset = Carrier.objects.all()

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
    def update_ip(ip, data, user):

        for key, value in data.items():
            setattr(ip, key, value)

        ip.save()

        return ip

    @staticmethod
    def delete_ip(ip):

        ip.delete()