from django.db import models

from apps.common.models import BaseModel
from apps.sip.models import SIPAccount


class ProvisionJob(BaseModel):

    ACTION_CHOICES = (
        ("CREATE", "Create"),
        ("UPDATE", "Update"),
        ("DELETE", "Delete"),
    )

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("RUNNING", "Running"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    sip_account = models.ForeignKey(
        SIPAccount,
        on_delete=models.CASCADE,
        related_name="jobs",
    )

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        default="CREATE",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    message = models.TextField(
        blank=True
    )

    error = models.TextField(
        blank=True
    )

    retry_count = models.PositiveIntegerField(
        default=0
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "provision_jobs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.action} | {self.sip_account.username} | {self.status}"