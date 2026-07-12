import django_filters
from django.db.models import Q

from .models import CallRecord


class CallRecordFilter(django_filters.FilterSet):

    search = django_filters.CharFilter(
        method="filter_search"
    )

    start_date = django_filters.DateFilter(
        field_name="start_time",
        lookup_expr="date__gte",
    )

    end_date = django_filters.DateFilter(
        field_name="start_time",
        lookup_expr="date__lte",
    )

    disposition = django_filters.CharFilter(
        lookup_expr="iexact"
    )

    class Meta:
        model = CallRecord
        fields = [
            "disposition",
            "start_date",
            "end_date",
        ]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(caller_number__icontains=value)
            | Q(receiver_number__icontains=value)
            | Q(channel__icontains=value)
            | Q(destination_channel__icontains=value)
        )