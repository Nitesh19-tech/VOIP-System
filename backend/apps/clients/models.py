from django.db import models
from django.conf import settings

from apps.common.models import BaseModel


class Client(BaseModel):

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="clients",
        limit_choices_to={"role": "COMPANY_ADMIN"},
        null=True,
        blank=True,
    )

    name = models.CharField(max_length=255)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20)

    address = models.TextField(blank=True)

    class Meta:
        db_table = "clients"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name