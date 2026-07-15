from django.urls import path

from .views import (
    CarrierListCreateAPIView,
    CarrierDetailAPIView,
    CarrierIPListCreateAPIView,
    CarrierIPDetailAPIView,
)

urlpatterns = [

    path(
        "",
        CarrierListCreateAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        CarrierDetailAPIView.as_view(),
    ),

    path(
        "ips/",
        CarrierIPListCreateAPIView.as_view(),
    ),

    path(
        "ips/<int:pk>/",
        CarrierIPDetailAPIView.as_view(),
    ),

]