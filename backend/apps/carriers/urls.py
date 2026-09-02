from django.urls import path

from .views import (
    CarrierListCreateAPIView,
    CarrierDetailAPIView,
    CarrierIPListCreateAPIView,
    CarrierIPDetailAPIView,
    TerminationListCreateAPIView,
    TerminationDetailAPIView,
    TerminationImportAPIView,
)


urlpatterns = [

    # =====================================================
    # CARRIERS
    # =====================================================

    path(
        "",
        CarrierListCreateAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        CarrierDetailAPIView.as_view(),
    ),

    # =====================================================
    # CARRIER IPS
    # =====================================================

    path(
        "ips/",
        CarrierIPListCreateAPIView.as_view(),
    ),

    path(
        "ips/<int:pk>/",
        CarrierIPDetailAPIView.as_view(),
    ),

    # =====================================================
    # TERMINATIONS
    # =====================================================

    path(
        "terminations/",
        TerminationListCreateAPIView.as_view(),
    ),

    # =====================================================
    # TERMINATION CSV IMPORT
    # =====================================================

    path(
        "terminations/import/",
        TerminationImportAPIView.as_view(),
        name="termination-import",
    ),

    path(
        "terminations/<int:pk>/",
        TerminationDetailAPIView.as_view(),
    ),

]