from django.db import models

from apps.common.models import BaseModel


class Trunk(BaseModel):

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    TRANSPORT_CHOICES = (
        ("UDP", "UDP"),
        ("TCP", "TCP"),
        ("TLS", "TLS"),
    )

    provider_name = models.CharField(
        max_length=100,
        unique=True,
    )

    host = models.CharField(
        max_length=255,
    )

    port = models.PositiveIntegerField(
        default=5060,
    )

    username = models.CharField(
        max_length=100,
        blank=True,
    )

    password = models.CharField(
        max_length=255,
        blank=True,
    )

    transport = models.CharField(
        max_length=10,
        choices=TRANSPORT_CHOICES,
        default="UDP",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE",
    )

    qualify = models.BooleanField(
        default=True,
    )

    nat = models.BooleanField(
        default=True,
    )

    codecs = models.CharField(
        max_length=100,
        default="ulaw,alaw",
    )

    register_string = models.TextField(
        blank=True,
    )

    realm = models.CharField(
        max_length=255,
        blank=True,
    )

    from_user = models.CharField(
        max_length=100,
        blank=True,
    )

    outbound_proxy = models.CharField(
        max_length=255,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:

        db_table = "trunks"

        ordering = [
            "provider_name",
        ]

    def __str__(self):

        return self.provider_name