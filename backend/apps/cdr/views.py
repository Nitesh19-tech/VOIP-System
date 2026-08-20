import csv

from django.http import HttpResponse

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import CallRecordFilter
from .models import CallRecord
from .serializers import CallRecordSerializer
from .statistics import CDRStatistics


# =========================================================
# CDR PAGINATION
# =========================================================

class CDRPagination(PageNumberPagination):

    page_size = 25

    # Frontend:
    # ?page_size=25
    # ?page_size=50
    # ?page_size=100
    # ?page_size=500
    # ?page_size=all

    page_size_query_param = "page_size"

    # Maximum normal page size
    max_page_size = 500

    def paginate_queryset(
        self,
        queryset,
        request,
        view=None,
    ):

        value = request.query_params.get(
            self.page_size_query_param
        )

        # -------------------------------------------------
        # ALL
        # -------------------------------------------------

        if value and value.lower() == "all":

            count = queryset.count()

            self.page_size = max(
                count,
                1,
            )

        else:

            self.page_size = 25

        return super().paginate_queryset(
            queryset,
            request,
            view,
        )


# =========================================================
# COMMON CDR QUERYSET
# =========================================================

def get_cdr_queryset():

    return (
        CallRecord.objects
        .select_related(
            "caller",
            "receiver",
            "country",
            "number_pool",
            "number_pool__carrier",
            "number_pool__termination",
            "number_pool__client",
        )
        .order_by(
            "-start_time"
        )
    )


# =========================================================
# CALL RECORD LIST
# =========================================================

class CallRecordListView(ListAPIView):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        CallRecordSerializer
    )

    pagination_class = (
        CDRPagination
    )

    queryset = (
        get_cdr_queryset()
    )

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = (
        CallRecordFilter
    )

    search_fields = [
        "caller_number",
        "receiver_number",
        "caller_name",
        "receiver_name",
        "channel",
        "destination_channel",
        "uniqueid",
    ]

    ordering_fields = [
        "start_time",
        "duration",
        "billsec",
        "caller_number",
        "receiver_number",
    ]

    ordering = [
        "-start_time",
    ]


# =========================================================
# CALL STATISTICS
# =========================================================

class CallStatisticsView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response(
            CDRStatistics.summary()
        )


# =========================================================
# CALL RECORD EXPORT
# =========================================================

class CallRecordExportView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        queryset = (
            get_cdr_queryset()
        )

        # -------------------------------------------------
        # APPLY SAME FILTERS AS CDR LIST
        # -------------------------------------------------

        queryset = (
            CallRecordFilter(
                request.GET,
                queryset=queryset,
            )
            .qs
        )

        # -------------------------------------------------
        # CSV RESPONSE
        # -------------------------------------------------

        response = HttpResponse(
            content_type="text/csv"
        )

        response[
            "Content-Disposition"
        ] = (
            'attachment; '
            'filename="cdr_export.csv"'
        )

        writer = csv.writer(
            response
        )

        # -------------------------------------------------
        # HEADER
        # -------------------------------------------------

        writer.writerow([
            "Date",
            "Carrier",
            "Termination",
            "Number",
            "CLI",
            "Currency",
            "Duration",
            "Payterm",
            "Payout",
            "Client",
            "C Payterm",
            "C Payout",
            "Cause",
        ])

        # -------------------------------------------------
        # DATA
        # -------------------------------------------------

        for call in queryset:

            number = ""
            currency = ""
            payterm = ""
            payout = ""
            carrier = ""
            termination = ""
            client = ""

            if call.number_pool:

                number = (
                    call.number_pool.did_number
                    or call.number_pool.number
                    or call.receiver_number
                    or ""
                )

                currency = (
                    call.number_pool.currency
                    or ""
                )

                payterm = (
                    call.number_pool.payterm
                    or ""
                )

                payout = (
                    call.number_pool.payout
                    or ""
                )

                if call.number_pool.carrier:

                    carrier = (
                        call.number_pool.carrier.name
                        or ""
                    )

                if call.number_pool.termination:

                    termination = (
                        call.number_pool.termination.name
                        or ""
                    )

                if call.number_pool.client:

                    client = (
                        call.number_pool.client.name
                        or ""
                    )

            writer.writerow([
                call.start_time,
                carrier,
                termination,
                number,
                call.caller_number,
                currency,
                call.duration,
                payterm,
                payout,
                client,
                "",
                "",
                call.disposition,
            ])

        return response


# =========================================================
# FAILED REPORTS LIST
# =========================================================

class FailedReportsListView(ListAPIView):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        CallRecordSerializer
    )

    pagination_class = (
        CDRPagination
    )

    # -----------------------------------------------------
    # ONLY FAILED CALLS
    # -----------------------------------------------------

    queryset = (
        CallRecord.objects
        .filter(
            disposition="FAILED"
        )
        .select_related(
            "caller",
            "receiver",
            "country",
            "number_pool",
            "number_pool__carrier",
            "number_pool__termination",
            "number_pool__client",
        )
        .prefetch_related(
            "number_pool__carrier__ips"
        )
        .order_by(
            "-start_time"
        )
    )

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = (
        CallRecordFilter
    )

    search_fields = [
        "caller_number",
        "receiver_number",
        "caller_name",
        "receiver_name",
        "channel",
        "destination_channel",
        "uniqueid",
    ]

    ordering_fields = [
        "start_time",
        "caller_number",
        "receiver_number",
        "duration",
    ]

    ordering = [
        "-start_time",
    ]


# =========================================================
# FAILED REPORTS EXPORT
# =========================================================

class FailedReportsExportView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        # -------------------------------------------------
        # ONLY FAILED CALLS
        # -------------------------------------------------

        queryset = (
            CallRecord.objects
            .filter(
                disposition="FAILED"
            )
            .select_related(
                "caller",
                "receiver",
                "country",
                "number_pool",
                "number_pool__carrier",
                "number_pool__termination",
                "number_pool__client",
            )
            .prefetch_related(
                "number_pool__carrier__ips"
            )
            .order_by(
                "-start_time"
            )
        )

        # -------------------------------------------------
        # APPLY FILTERS
        # -------------------------------------------------

        queryset = (
            CallRecordFilter(
                request.GET,
                queryset=queryset,
            )
            .qs
        )

        # -------------------------------------------------
        # CSV RESPONSE
        # -------------------------------------------------

        response = HttpResponse(
            content_type="text/csv"
        )

        response[
            "Content-Disposition"
        ] = (
            'attachment; '
            'filename="failed_reports.csv"'
        )

        writer = csv.writer(
            response
        )

        # -------------------------------------------------
        # HEADER
        # -------------------------------------------------

        writer.writerow([
            "Date",
            "Carrier",
            "Number",
            "CLI",
            "IP",
            "Cause",
        ])

        # -------------------------------------------------
        # DATA
        # -------------------------------------------------

        for call in queryset:

            carrier = ""

            number = (
                call.receiver_number
                or call.caller_number
                or ""
            )

            carrier_ip = ""

            # -------------------------------------------------
            # NUMBER POOL
            # -------------------------------------------------

            if call.number_pool:

                # NUMBER

                number = (
                    call.number_pool.did_number
                    or call.number_pool.number
                    or number
                )

                # CARRIER

                if call.number_pool.carrier:

                    carrier = (
                        call.number_pool.carrier.name
                        or ""
                    )

                    # -----------------------------------------
                    # CARRIER IPs
                    # -----------------------------------------

                    carrier_ips = (
                        call.number_pool
                        .carrier
                        .ips
                        .all()
                    )

                    carrier_ip = ", ".join(
                        str(ip.ip_address)
                        for ip in carrier_ips
                    )

            # -------------------------------------------------
            # WRITE ROW
            # -------------------------------------------------

            writer.writerow([
                call.start_time,
                carrier,
                number,
                call.caller_number,
                carrier_ip,
                call.disposition,
            ])

        return response