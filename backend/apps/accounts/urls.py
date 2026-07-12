from django.urls import path
from .views import (
    LoginAPIView,
    ProfileAPIView,
    ChangePasswordAPIView,
    LogoutAPIView,
    UserListCreateAPIView,
    UserDetailAPIView,
)



urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path(
        "change-password/",
        ChangePasswordAPIView.as_view(),
        name="change-password",
    ),
    path(
    "logout/",
    LogoutAPIView.as_view(),
    name="logout",
),
path("users/", UserListCreateAPIView.as_view(), name="users"),

path("users/<int:pk>/", UserDetailAPIView.as_view(), name="user-detail"),
]