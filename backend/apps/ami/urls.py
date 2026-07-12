from django.urls import path

from .views import LiveCallListAPIView

urlpatterns = [

    path(
        "live-calls/",
        LiveCallListAPIView.as_view(),
        name="live-calls",
    ),

]