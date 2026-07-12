from django.db import models

from apps.common.models import BaseModel


class Company(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    code = models.CharField(max_length=50, unique=True)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20)

    address = models.TextField(blank=True)

    city = models.CharField(max_length=100, blank=True)

    state = models.CharField(max_length=100, blank=True)

    country = models.CharField(max_length=100, default="India")

    logo = models.ImageField(
        upload_to="company_logos/",
        blank=True,
        null=True
    )

    class Meta:
        db_table = "companies"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name