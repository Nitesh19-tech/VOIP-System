from django.db import models

from apps.companies.models import Company


class InboundRoute(models.Model):

    ACTIONS = [

        ("extension", "Extension"),
        ("ivr", "IVR"),
        ("queue", "Queue"),
        ("ringgroup", "Ring Group"),

    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="inbound_routes",
    )

    did = models.CharField(
        max_length=50,
        unique=True,
    )

    description = models.CharField(
        max_length=200,
        blank=True,
    )

    destination_type = models.CharField(
        max_length=20,
        choices=ACTIONS,
    )

    destination = models.CharField(
        max_length=100,
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