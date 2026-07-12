from django.db.models import Avg, Count, Sum
from django.utils import timezone

from .models import CallRecord


class CDRStatistics:

    @staticmethod
    def summary():

        today = timezone.localdate()

        queryset = CallRecord.objects.all()

        return {

            "total_calls": queryset.count(),

            "answered": queryset.filter(
                disposition="ANSWERED"
            ).count(),

            "busy": queryset.filter(
                disposition="BUSY"
            ).count(),

            "failed": queryset.filter(
                disposition="FAILED"
            ).count(),

            "no_answer": queryset.filter(
                disposition="NO ANSWER"
            ).count(),

            "today_calls": queryset.filter(
                start_time__date=today
            ).count(),

            "total_duration": queryset.aggregate(
                Sum("duration")
            )["duration__sum"] or 0,

            "average_duration": queryset.aggregate(
                Avg("duration")
            )["duration__avg"] or 0,
        }