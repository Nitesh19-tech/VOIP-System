from django.db import models

from apps.common.models import BaseModel
from apps.routing_plans.models import RoutingPlan
from apps.carriers.models import Carrier


class Route(BaseModel):

    routing_plan = models.ForeignKey(
        RoutingPlan,
        on_delete=models.CASCADE,
        related_name="routes",
    )

    carrier = models.ForeignKey(
        Carrier,
        on_delete=models.PROTECT,
        related_name="routes",
    )

    prefix = models.CharField(
        max_length=30,
    )

    strip_digits = models.PositiveIntegerField(
        default=0,
    )

    add_prefix = models.CharField(
        max_length=30,
        blank=True,
        default="",
    )

    priority = models.PositiveIntegerField(
        default=1,
    )

    description = models.TextField(
        blank=True,
        default="",
    )

    class Meta:

        db_table = "routes"

        ordering = [
            "routing_plan",
            "priority",
            "prefix",
        ]

        unique_together = (
            "routing_plan",
            "carrier",
            "prefix",
            "priority",
        )

    def __str__(self):

        return (
            f"{self.routing_plan.name} | "
            f"{self.prefix} | "
            f"{self.carrier.name}"
        )