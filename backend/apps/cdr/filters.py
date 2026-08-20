import django_filters
from django.db.models import Q

from .models import CallRecord


class CallRecordFilter(django_filters.FilterSet):

    # =====================================================
    # GENERAL SEARCH
    # =====================================================

    search = django_filters.CharFilter(
        method="filter_search"
    )

    # =====================================================
    # DATE
    # =====================================================

    start_date = django_filters.DateFilter(
        field_name="start_time",
        lookup_expr="date__gte",
    )

    end_date = django_filters.DateFilter(
        field_name="start_time",
        lookup_expr="date__lte",
    )

    # =====================================================
    # DISPOSITION / CAUSE
    # =====================================================

    disposition = django_filters.CharFilter(
        field_name="disposition",
        lookup_expr="iexact",
    )

    # =====================================================
    # CARRIER
    #
    # NumberPool -> Carrier
    # =====================================================

    carrier = django_filters.CharFilter(
        method="filter_carrier"
    )

    # =====================================================
    # TERMINATION
    #
    # NumberPool -> Termination
    # =====================================================

    termination = django_filters.CharFilter(
        method="filter_termination"
    )

    # =====================================================
    # NUMBER / DID
    # =====================================================

    number = django_filters.CharFilter(
        method="filter_number"
    )

    # =====================================================
    # CLI
    # =====================================================

    cli = django_filters.CharFilter(
        field_name="caller_number",
        lookup_expr="icontains",
    )

    # =====================================================
    # CLIENT
    #
    # NumberPool -> Client
    # =====================================================

    client = django_filters.CharFilter(
        method="filter_client"
    )

    # =====================================================
    # MANAGER
    #
    # Current CallRecord model does not have a direct
    # manager field.
    #
    # This filter is intentionally handled separately
    # instead of assuming a relation that may not exist.
    # =====================================================

    manager = django_filters.CharFilter(
        method="filter_manager"
    )

    # =====================================================
    # GROUP BY
    #
    # Grouping is handled by the view/report layer.
    # This filter is accepted so the frontend can send it.
    # =====================================================

    group_by = django_filters.CharFilter(
        method="filter_group_by"
    )

    # =====================================================
    # META
    # =====================================================

    class Meta:

        model = CallRecord

        fields = [
            "search",
            "start_date",
            "end_date",
            "disposition",
            "carrier",
            "termination",
            "number",
            "cli",
            "client",
            "manager",
            "group_by",
        ]

    # =====================================================
    # SEARCH
    # =====================================================

    def filter_search(
        self,
        queryset,
        name,
        value,
    ):

        if not value:
            return queryset

        return queryset.filter(

            Q(
                caller_number__icontains=value
            )

            | Q(
                receiver_number__icontains=value
            )

            | Q(
                caller_name__icontains=value
            )

            | Q(
                receiver_name__icontains=value
            )

            | Q(
                channel__icontains=value
            )

            | Q(
                destination_channel__icontains=value
            )

            | Q(
                uniqueid__icontains=value
            )

            | Q(
                number_pool__did_number__icontains=value
            )

            | Q(
                number_pool__number__icontains=value
            )

        )

    # =====================================================
    # CARRIER
    # =====================================================

    def filter_carrier(
        self,
        queryset,
        name,
        value,
    ):

        if not value:
            return queryset

        return queryset.filter(
            number_pool__carrier__name__icontains=value
        )

    # =====================================================
    # TERMINATION
    # =====================================================

    def filter_termination(
        self,
        queryset,
        name,
        value,
    ):

        if not value:
            return queryset

        return queryset.filter(
            number_pool__termination__name__icontains=value
        )

    # =====================================================
    # NUMBER
    # =====================================================

    def filter_number(
        self,
        queryset,
        name,
        value,
    ):

        if not value:
            return queryset

        return queryset.filter(

            Q(
                number_pool__did_number__icontains=value
            )

            | Q(
                number_pool__number__icontains=value
            )

            | Q(
                receiver_number__icontains=value
            )

            | Q(
                caller_number__icontains=value
            )

        )

    # =====================================================
    # CLIENT
    # =====================================================

    def filter_client(
        self,
        queryset,
        name,
        value,
    ):

        if not value:
            return queryset

        return queryset.filter(
            number_pool__client__name__icontains=value
        )

    # =====================================================
    # MANAGER
    # =====================================================

    def filter_manager(
        self,
        queryset,
        name,
        value,
    ):

        """
        Current CallRecord model has no direct manager
        relation.

        Do not assume a manager field exists.

        For now, return the queryset unchanged so that
        sending manager from the frontend does not break
        the CDR API.
        """

        return queryset

    # =====================================================
    # GROUP BY
    # =====================================================

    def filter_group_by(
        self,
        queryset,
        name,
        value,
    ):

        """
        Group By is a report operation, not a normal
        queryset filter.

        It is accepted here so ?group_by=... does not
        cause an unknown-filter error.

        Actual grouping should be implemented separately
        if/when the backend needs aggregated CDR results.
        """

        return queryset