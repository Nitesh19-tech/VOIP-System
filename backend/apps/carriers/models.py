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