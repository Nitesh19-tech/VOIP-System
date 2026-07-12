import csv

from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import CallRecordFilter
from .models import CallRecord
from .serializers import CallRecordSerializer
from .statistics import CDRStatistics


class CallRecordListView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = CallRecordSerializer

    queryset = (
        CallRecord.objects
        .select_related(
            "caller",
            "receiver",
        )
        .order_by("-start_time")
    )

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = CallRecordFilter

    search_fields = [
        "caller_number",
        "receiver_number",
        "caller_name",
        "receiver_name",
        "channel",
        "destination_channel",
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


class CallStatisticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            CDRStatistics.summary()
        )


class CallRecordExportView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        queryset = (
            CallRecord.objects
            .select_related(
                "caller",
                "receiver",
            )
            .order_by("-start_time")
        )

        # Apply same filters as CDR list
        queryset = CallRecordFilter(
            request.GET,
            queryset=queryset,
        ).qs

        response = HttpResponse(
            content_type="text/csv"
        )

        response[
            "Content-Disposition"
        ] = 'attachment; filename="cdr_export.csv"'

        writer = csv.writer(response)

        writer.writerow([
            "Date",
            "Caller Number",
            "Receiver Number",
            "Caller Name",
            "Receiver Name",
            "Duration (Sec)",
            "Talk Time (Sec)",
            "Disposition",
            "Context",
            "Application",
            "Channel",
            "Destination Channel",
        ])

        for call in queryset:

            writer.writerow([
                call.start_time,
                call.caller_number,
                call.receiver_number,
                call.caller_name,
                call.receiver_name,
                call.duration,
                call.billsec,
                call.disposition,
                call.context,
                call.application,
                call.channel,
                call.destination_channel,
            ])

        return response