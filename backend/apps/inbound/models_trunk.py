from django.db import models

from apps.companies.models import Company


class InboundTrunk(models.Model):

    AUTH_TYPES = (
        ("ip", "IP Authentication"),
        ("registration", "Registration"),
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="inbound_trunks",
    )

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    auth_type = models.CharField(
        max_length=20,
        choices=AUTH_TYPES,
        default="ip",
    )

    host = models.CharField(
        max_length=100,
    )

    ip_address = models.GenericIPAddressField()

    context = models.CharField(
        max_length=100,
        default="company-inbound",
    )

    transport = models.CharField(
        max_length=20,
        default="transport-udp",
    )

    enabled = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name