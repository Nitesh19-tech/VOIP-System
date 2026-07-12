from django.urls import path

from .views import (
    SIPAccountListCreateAPIView,
    SIPAccountDetailAPIView,
)

urlpatterns = [

    path(
        "",
        SIPAccountListCreateAPIView.as_view(),
        name="sip-list-create"
    ),

    path(
        "<int:pk>/",
        SIPAccountDetailAPIView.as_view(),
        name="sip-detail"
    ),

]