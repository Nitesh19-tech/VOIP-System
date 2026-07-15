from django.urls import path

from .views import (
    RoutingPlanListCreateAPIView,
    RoutingPlanDetailAPIView,
)

urlpatterns = [

    path(
        "",
        RoutingPlanListCreateAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        RoutingPlanDetailAPIView.as_view(),
    ),

]