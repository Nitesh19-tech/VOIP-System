from django.urls import path

from .views import (
    # Rate
    RateListCreateAPIView,
    RateDetailAPIView,
)

urlpatterns = [

    # ======================================================
    # Rate Management
    # ======================================================

    path(
        "rates/",
        RateListCreateAPIView.as_view(),
        name="rate-list-create",
    ),

    path(
        "rates/<int:pk>/",
        RateDetailAPIView.as_view(),
        name="rate-detail",
    ),

]