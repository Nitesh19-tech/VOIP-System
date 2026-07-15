from django.urls import path

from .views import (
    RouteListCreateAPIView,
    RouteDetailAPIView,
)

urlpatterns = [

    path(
        "",
        RouteListCreateAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        RouteDetailAPIView.as_view(),
    ),

]