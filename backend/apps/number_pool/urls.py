from django.urls import path

from .views import (
    NumberPoolListCreateAPIView,
    NumberPoolDetailAPIView,
    NumberPoolImportAPIView,
    NumberPoolStatisticsAPIView,
    BulkAllocationAPIView,
    BulkUnallocationAPIView,
    AutoAssignAPIView,
)

from .country_views import (
    CountryListCreateAPIView,
    CountryDetailAPIView,
    CountryImportAPIView,
)


urlpatterns = [

    # =====================================================
    # Number Pool
    # =====================================================

    path(
        "",
        NumberPoolListCreateAPIView.as_view(),
        name="number-list-create",
    ),

    path(
        "<int:pk>/",
        NumberPoolDetailAPIView.as_view(),
        name="number-detail",
    ),

    path(
        "import/",
        NumberPoolImportAPIView.as_view(),
        name="number-import",
    ),

    path(
        "statistics/",
        NumberPoolStatisticsAPIView.as_view(),
        name="number-statistics",
    ),

    # =====================================================
    # Bulk Allocation
    # =====================================================

    path(
        "bulk-allocation/",
        BulkAllocationAPIView.as_view(),
        name="bulk-allocation",
    ),

    # =====================================================
    # Bulk Unallocation
    # =====================================================

    path(
        "bulk-unallocation/",
        BulkUnallocationAPIView.as_view(),
        name="bulk-unallocation",
    ),

    # =====================================================
    # Auto Assign Numbers
    # =====================================================

    path(
        "auto-assign/",
        AutoAssignAPIView.as_view(),
        name="auto-assign",
    ),

    # =====================================================
    # Countries
    # =====================================================

    path(
        "countries/",
        CountryListCreateAPIView.as_view(),
        name="country-list-create",
    ),

    path(
        "countries/<int:pk>/",
        CountryDetailAPIView.as_view(),
        name="country-detail",
    ),

    path(
        "countries/import/",
        CountryImportAPIView.as_view(),
        name="country-import",
    ),
]