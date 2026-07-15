from django.urls import path

from .views import (
    CarrierListCreateAPIView,
    CarrierDetailAPIView,
    CarrierIPListCreateAPIView,
    CarrierIPDetailAPIView,
    TerminationListCreateAPIView,
    TerminationDetailAPIView,
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

    path(
        "terminations/",
        TerminationListCreateAPIView.as_view(),
    ),

    path(
        "terminations/<int:pk>/",
        TerminationDetailAPIView.as_view(),
    ),
    
]