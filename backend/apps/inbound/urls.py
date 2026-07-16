from django.urls import include
from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import InboundRouteViewSet
from .views_provision import ApplyInboundChangesView

router = DefaultRouter()

router.register(
    "routes",
    InboundRouteViewSet,
)

urlpatterns = [

    path("", include(router.urls)),

    path(
        "apply/",
        ApplyInboundChangesView.as_view(),
        name="apply-inbound",
    ),

]