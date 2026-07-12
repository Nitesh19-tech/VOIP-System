from django.urls import path

from .views import (
    CallRecordListView,
    CallStatisticsView,
    CallRecordExportView,
)

urlpatterns = [

    path(
        "",
        CallRecordListView.as_view(),
        name="cdr-list",
    ),

    path(
        "statistics/",
        CallStatisticsView.as_view(),
        name="cdr-statistics",
    ),

    path(
        "export/",
        CallRecordExportView.as_view(),
        name="cdr-export",
    ),

]