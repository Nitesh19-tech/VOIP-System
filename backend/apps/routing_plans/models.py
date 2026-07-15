from django.db import models

from apps.common.models import BaseModel


class RoutingPlan(BaseModel):

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
        default="",
    )

    is_default = models.BooleanField(
        default=False,
    )

    class Meta:

        db_table = "routing_plans"

        ordering = [
            "name",
        ]

        verbose_name = "Routing Plan"

        verbose_name_plural = "Routing Plans"

    def __str__(self):

        return self.name
    