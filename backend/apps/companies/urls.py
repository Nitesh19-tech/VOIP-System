from django.urls import path
from .views import (
    CompanyListCreateAPIView,
    CompanyDetailAPIView,
)

urlpatterns = [
    path(
        "",
        CompanyListCreateAPIView.as_view(),
        name="company-list-create",
    ),

    path(
        "<int:pk>/",
        CompanyDetailAPIView.as_view(),
        name="company-detail",
    ),
]