from django.db import models
from django.conf import settings

from apps.common.models import BaseModel
from apps.clients.models import Client
from apps.number_pool.models import NumberPool


class SIPAccount(BaseModel):

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
        ("SUSPENDED", "Suspended"),
    )

    TRANSPORT_CHOICES = (
        ("UDP", "UDP"),
        ("TCP", "TCP"),
        ("TLS", "TLS"),
    )

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sip_accounts",
        limit_choices_to={"role": "COMPANY_ADMIN"},
        null=True,
        blank=True,
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="sip_accounts",
    )

    # Optional DID Mapping
    number = models.OneToOneField(
        NumberPool,
        on_delete=models.PROTECT,
        related_name="sip_account",
        null=True,
        blank=True,
    )

    username = models.CharField(
        max_length=50,
        unique=True,
    )

    password = models.CharField(
        max_length=255,
    )

    auth_id = models.CharField(
        max_length=50,
        unique=True,
    )

    domain = models.CharField(
        max_length=255,
        default="pbx.local",
        editable=False,
    )

    transport = models.CharField(
        max_length=10,
        choices=TRANSPORT_CHOICES,
        default="UDP",
    )

    context = models.CharField(
        max_length=100,
        default="from-internal",
        editable=False,
    )

    caller_id = models.CharField(
        max_length=100,
        blank=True,
    )

    codecs = models.CharField(
        max_length=255,
        default="ulaw,alaw",
        editable=False,
    )

    nat = models.BooleanField(
        default=True,
        editable=False,
    )

    qualify = models.BooleanField(
        default=True,
        editable=False,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE",
    )

    class Meta:
        db_table = "sip_accounts"
        ordering = ["username"]

    def __str__(self):

        if self.number:
            return f"{self.username} ({self.number.did_number})"

        return self.username