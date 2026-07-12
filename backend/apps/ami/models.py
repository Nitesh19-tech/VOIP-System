from django.db import models

from apps.common.models import BaseModel


class LiveCall(BaseModel):

    STATUS_CHOICES = (
        ("RINGING", "Ringing"),
        ("DIALING", "Dialing"),
        ("ANSWERED", "Answered"),
        ("HANGUP", "Hangup"),
    )


    uniqueid = models.CharField(
        max_length=100,
        unique=True,
    )

    linkedid = models.CharField(
        max_length=100,
        blank=True,
    )

    caller = models.CharField(
        max_length=50,
    )

    receiver = models.CharField(
        max_length=50,
    )

    caller_channel = models.CharField(
        max_length=200,
    )

    receiver_channel = models.CharField(
        max_length=200,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="RINGING",
    )

    started_at = models.DateTimeField(
        auto_now_add=True,
    )

    answered_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    ended_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:

        db_table = "live_calls"

        ordering = [
            "-started_at",
        ]

    def __str__(self):

        return f"{self.caller} → {self.receiver}"
    
class ExtensionStatus(BaseModel):

    STATUS_CHOICES = (
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
        ("UNAVAILABLE", "Unavailable"),
        ("UNKNOWN", "Unknown"),
    )

    extension = models.CharField(
        max_length=50,
        unique=True,
    )

    caller_id = models.CharField(
        max_length=100,
        blank=True,
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    port = models.IntegerField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UNKNOWN",
    )

    last_seen = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "extension_status"

    def __str__(self):
        return self.extension