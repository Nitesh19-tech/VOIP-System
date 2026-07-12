from django.urls import path

from .views import (
    TrunkListCreateAPIView,
    TrunkDetailAPIView,
)

urlpatterns = [

    path(
        "",
        TrunkListCreateAPIView.as_view(),
        name="trunk-list-create",
    ),

    path(
        "<int:pk>/",
        TrunkDetailAPIView.as_view(),
        name="trunk-detail",
    ),

]