from django.urls import path
from .views import ActiveCallAPIView, DashboardOverviewAPIView, DeviceAPIView, ExtensionStatusAPIView

urlpatterns = [
    path(
        "overview/",
        DashboardOverviewAPIView.as_view(),
        name="dashboard-overview",
    ),

    path(
    "extensions/",
    ExtensionStatusAPIView.as_view(),
    name="dashboard-extensions",
    ),

    path(
    "devices/",
    DeviceAPIView.as_view(),
    name="dashboard-devices",
    ),

    path(
    "active-calls/",
    ActiveCallAPIView.as_view(),
    name="dashboard-active-calls",
    ),
]