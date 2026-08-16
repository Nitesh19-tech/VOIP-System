from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import UserManager
from .constants import ROLE_CHOICES, CLIENT


class User(AbstractBaseUser, PermissionsMixin):

    first_name = models.CharField(
        max_length=100,
    )

    last_name = models.CharField(
        max_length=100,
        blank=True,
    )

    email = models.EmailField(
        unique=True,
    )

    mobile = models.CharField(
        max_length=15,
        blank=True,
    )

    profile_image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        default=CLIENT,
    )

    # =====================================================
    # PASSWORD
    # =====================================================

    force_password_change = models.BooleanField(
        default=False,
    )

    # =====================================================
    # STATUS
    # =====================================================

    is_active = models.BooleanField(
        default=True,
    )

    is_staff = models.BooleanField(
        default=False,
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    # =====================================================
    # MANAGER
    # =====================================================

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    # =====================================================
    # META
    # =====================================================

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]

    # =====================================================
    # STRING
    # =====================================================

    def __str__(self):
        return self.email

    # =====================================================
    # FULL NAME
    # =====================================================

    @property
    def full_name(self):
        return (
            f"{self.first_name} "
            f"{self.last_name}"
        ).strip()