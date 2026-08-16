from django.db import models

from apps.carriers.models import Termination


class InboundRoute(models.Model):

    did = models.CharField(
        max_length=50,
        unique=True,
    )

    description = models.CharField(
        max_length=200,
        blank=True,
    )

    forward_number = models.CharField(
        max_length=50,
        blank=True,
        default="",
    )

    termination = models.ForeignKey(
        Termination,
        on_delete=models.PROTECT,
        related_name="inbound_routes",
        null=True,
        blank=True,
    )

    priority = models.IntegerField(
        default=1,
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
        return self.did