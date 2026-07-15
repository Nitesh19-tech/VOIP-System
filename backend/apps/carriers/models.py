from decimal import Decimal

from django.db import models

from apps.common.models import BaseModel


class Carrier(BaseModel):

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "carriers"
        ordering = ["name"]
        verbose_name = "Carrier"
        verbose_name_plural = "Carriers"

    def __str__(self):
        return self.name


class CarrierIP(BaseModel):

    carrier = models.ForeignKey(
        Carrier,
        on_delete=models.CASCADE,
        related_name="ips",
    )

    ip_address = models.GenericIPAddressField()

    class Meta:
        db_table = "carrier_ips"
        ordering = ["carrier", "ip_address"]
        constraints = [
            models.UniqueConstraint(
                fields=["carrier", "ip_address"],
                name="unique_carrier_ip",
            )
        ]
        verbose_name = "Carrier IP"
        verbose_name_plural = "Carrier IPs"

    def __str__(self):
        return f"{self.carrier.name} - {self.ip_address}"


class Termination(BaseModel):

    PAYMENT_TERMS = [
        ("Daily", "Daily"),
        ("Weekly", "Weekly"),
        ("Weekly7", "Weekly7"),
        ("Monthly30", "Monthly30"),
        ("Monthly45", "Monthly45"),
        ("Monthly60", "Monthly60"),
    ]

    carrier = models.ForeignKey(
        Carrier,
        on_delete=models.CASCADE,
        related_name="terminations",
    )

    name = models.CharField(
        max_length=100,
    )

    prefix = models.CharField(
        max_length=20,
    )

    currency = models.CharField(
        max_length=10,
        default="USD",
    )

    payment_term = models.CharField(
        max_length=20,
        choices=PAYMENT_TERMS,
        default="Monthly30",
    )

    carrier_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    daily_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    weekly_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    weekly7_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    monthly30_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    monthly45_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    monthly60_payout = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=Decimal("0.0000"),
    )

    max_duration = models.PositiveIntegerField(
        default=0,
    )

    info = models.TextField(
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "terminations"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["carrier", "name"],
                name="unique_carrier_termination",
            )
        ]
        verbose_name = "Termination"
        verbose_name_plural = "Terminations"

    def __str__(self):
        return self.name