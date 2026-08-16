from django.db import models
from django.conf import settings

from apps.common.models import BaseModel
from apps.clients.models import Client
from apps.carriers.models import Carrier, Termination


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

    # =====================================================
    # ADMIN
    # =====================================================

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="numbers",
        limit_choices_to={"role": "COMPANY_ADMIN"},
        null=True,
        blank=True,
    )

    # =====================================================
    # CLIENT
    # =====================================================

    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="numbers",
    )

    # =====================================================
    # CARRIER
    # =====================================================

    carrier = models.ForeignKey(
        Carrier,
        on_delete=models.PROTECT,
        related_name="numbers",
        null=True,
        blank=True,
    )

    # =====================================================
    # TERMINATION
    # =====================================================

    termination = models.ForeignKey(
        Termination,
        on_delete=models.PROTECT,
        related_name="numbers",
        null=True,
        blank=True,
    )

    # =====================================================
    # COUNTRY
    # =====================================================

    country = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name="numbers",
    )

    # =====================================================
    # CSV DATA
    # =====================================================

    range_name = models.CharField(
        max_length=255,
        blank=True,
        default="",
        db_column="Range_Name",
    )

    number = models.CharField(
        max_length=30,
        unique=True,
        null=True,
        blank=True,
        db_column="Number",
    )

    qty = models.DecimalField(
        max_digits=15,
        decimal_places=4,
        null=True,
        blank=True,
        db_column="Qty",
    )

    currency = models.CharField(
        max_length=10,
        blank=True,
        default="",
        db_column="Currency",
    )

    payterm = models.IntegerField(
        default=30,
        db_column="Payterm",
    )

    payout = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Payout",
    )

    daily = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Daily",
    )

    weekly = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Weekly",
    )

    weekly7 = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Weekly7",
    )

    monthly30 = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Monthly30",
    )

    monthly45 = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Monthly45",
    )

    monthly60 = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=0,
        db_column="Monthly60",
    )

    prefix = models.CharField(
        max_length=30,
        blank=True,
        default="",
        db_column="Prefix",
    )

    # =====================================================
    # SYSTEM FIELDS
    # =====================================================

    did_number = models.CharField(
        max_length=30,
        unique=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AVAILABLE",
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

    # =====================================================
    # META
    # =====================================================

    class Meta:
        db_table = "number_pool"

        ordering = [
            "country",
            "did_number",
        ]

    # =====================================================
    # STRING
    # =====================================================

    def __str__(self):
        return self.did_number
    