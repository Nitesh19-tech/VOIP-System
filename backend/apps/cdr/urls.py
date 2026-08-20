from django.urls import path

from .views import (
    CallRecordListView,
    CallStatisticsView,
    CallRecordExportView,
    FailedReportsListView,
    FailedReportsExportView,
)


urlpatterns = [

    # =====================================================
    # CDR LIST
    # =====================================================

    path(
        "",
        CallRecordListView.as_view(),
        name="cdr-list",
    ),

    # =====================================================
    # CDR STATISTICS
    # =====================================================

    path(
        "statistics/",
        CallStatisticsView.as_view(),
        name="cdr-statistics",
    ),

    # =====================================================
    # CDR EXPORT
    # =====================================================

    path(
        "export/",
        CallRecordExportView.as_view(),
        name="cdr-export",
    ),

    # =====================================================
    # FAILED REPORTS
    # =====================================================

    path(
        "failed/",
        FailedReportsListView.as_view(),
        name="failed-reports-list",
    ),

    # =====================================================
    # FAILED REPORTS EXPORT
    # =====================================================

    path(
        "failed/export/",
        FailedReportsExportView.as_view(),
        name="failed-reports-export",
    ),

]