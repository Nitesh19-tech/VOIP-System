from django.db import models
from django.conf import settings

from apps.common.models import BaseModel
from apps.clients.models import Client


class Country(BaseModel):

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    iso_code = models.CharField(
        max_length=5,
        unique=True,
    )

    dial_code = models.CharField(
        max_length=10,
        unique=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "countries"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} (+{self.dial_code})"


class NumberPool(BaseModel):

    STATUS_CHOICES = (
        ("AVAILABLE", "Available"),
        ("ASSIGNED", "Assigned"),
        ("RESERVED", "Reserved"),
        ("DISABLED", "Disabled"),
    )

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="numbers",
        limit_choices_to={"role": "COMPANY_ADMIN"},
        null=True,
        blank=True,
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="numbers",
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name="numbers",
        
    )

    did_number = models.CharField(
        max_length=30,
        unique=True,
    )

    extension = models.CharField(
        max_length=10,
        unique=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AVAILABLE",
    )

    provider = models.CharField(
        max_length=100,
        blank=True,
    )

    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    monthly_rental = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    assigned_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        db_table = "number_pool"
        ordering = [
            "country",
            "did_number",
        ]

    def __str__(self):
        return self.did_number