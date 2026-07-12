from .models import NumberPool


class NumberPoolStatistics:

    @staticmethod
    def summary():

        queryset = NumberPool.objects.all()

        return {

            "total": queryset.count(),

            "available": queryset.filter(
                status="AVAILABLE"
            ).count(),

            "assigned": queryset.filter(
                status="ASSIGNED"
            ).count(),

            "reserved": queryset.filter(
                status="RESERVED"
            ).count(),

            "disabled": queryset.filter(
                status="DISABLED"
            ).count(),

        }