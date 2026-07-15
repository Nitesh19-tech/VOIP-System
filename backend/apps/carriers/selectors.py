from .models import Carrier


class CarrierSelector:

    @staticmethod
    def all():
        return Carrier.objects.prefetch_related("ips")

    @staticmethod
    def by_id(pk):
        return Carrier.objects.prefetch_related("ips").get(pk=pk)