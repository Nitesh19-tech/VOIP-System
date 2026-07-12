from django.db import models
from django.conf import settings

from apps.common.models import BaseModel
from apps.clients.models import Client
from apps.number_pool.models import Country


# ============================================================
# Wallet
# ============================================================

class Wallet(BaseModel):

    client = models.OneToOneField(
        Client,
        on_delete=models.CASCADE,
        related_name="wallet",
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    credit_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "wallets"
        ordering = ["client__name"]

    def __str__(self):
        return f"{self.client.name} Wallet"


# ============================================================
# Transaction
# ============================================================

class Transaction(BaseModel):

    TYPE_CHOICES = (
        ("RECHARGE", "Recharge"),
        ("DEBIT", "Debit"),
        ("REFUND", "Refund"),
        ("ADJUSTMENT", "Adjustment"),
    )

    wallet = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="transactions",
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "billing_transactions"
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.wallet.client.name} "
            f"{self.transaction_type} "
            f"{self.amount}"
        )


# ============================================================
# Rate Card
# ============================================================

class Rate(BaseModel):

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    BILLING_BLOCK_CHOICES = (
        (1, "1/1"),
        (6, "6/6"),
        (30, "30/30"),
        (60, "60/60"),
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name="rates",
    )

    destination = models.CharField(
        max_length=150,
    )

    prefix = models.CharField(
        max_length=20,
        db_index=True,
    )

    provider = models.CharField(
        max_length=100,
        blank=True,
    )

    buy_rate = models.DecimalField(
        max_digits=10,
        decimal_places=6,
    )

    sell_rate = models.DecimalField(
        max_digits=10,
        decimal_places=6,
    )

    billing_block = models.PositiveIntegerField(
        choices=BILLING_BLOCK_CHOICES,
        default=60,
    )

    minimum_duration = models.PositiveIntegerField(
        default=60,
    )

    connection_charge = models.DecimalField(
        max_digits=10,
        decimal_places=6,
        default=0,
    )

    effective_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE",
    )

    class Meta:

        db_table = "billing_rates"

        ordering = [
            "country__name",
            "destination",
        ]

        indexes = [
            models.Index(fields=["prefix"]),
            models.Index(fields=["status"]),
            models.Index(fields=["effective_date"]),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "prefix",
                    "provider",
                    "effective_date",
                ],
                name="unique_rate_version",
            )
        ]

    def __str__(self):
        return (
            f"{self.destination} "
            f"({self.prefix}) - "
            f"${self.sell_rate}/min"
        )