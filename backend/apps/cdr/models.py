from django.db import models

from apps.sip.models import SIPAccount


class CallRecord(models.Model):

    DISPOSITION_CHOICES = [
        ("ANSWERED", "Answered"),
        ("NO ANSWER", "No Answer"),
        ("BUSY", "Busy"),
        ("FAILED", "Failed"),
        ("CANCEL", "Cancel"),
    ]

    # =====================================================
    # SIP / CALL PARTICIPANTS
    # =====================================================

    caller = models.ForeignKey(
        SIPAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="outgoing_calls",
    )

    receiver = models.ForeignKey(
        SIPAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="incoming_calls",
    )

    caller_number = models.CharField(
        max_length=50,
        default="",
    )

    receiver_number = models.CharField(
        max_length=50,
        default="",
    )

    caller_name = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    receiver_name = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    # =====================================================
    # ASTERISK
    # =====================================================

    context = models.CharField(
        max_length=100,
        default="",
    )

    application = models.CharField(
        max_length=100,
        default="",
    )

    channel = models.CharField(
        max_length=150,
        default="",
    )

    destination_channel = models.CharField(
        max_length=150,
        blank=True,
        default="",
    )

    uniqueid = models.CharField(
        max_length=100,
        unique=True,
        default="",
    )

    disposition = models.CharField(
        max_length=30,
        choices=DISPOSITION_CHOICES,
        default="ANSWERED",
    )

    # =====================================================
    # TIMING
    # =====================================================

    start_time = models.DateTimeField()

    answer_time = models.DateTimeField(
        null=True,
        blank=True,
    )

    end_time = models.DateTimeField()

    duration = models.PositiveIntegerField(
        default=0,
    )

    billsec = models.PositiveIntegerField(
        default=0,
    )

    # =====================================================
    # NUMBER / INCOMING DID MAPPING
    # =====================================================

    country = models.ForeignKey(
        "number_pool.Country",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cdrs",
    )

    number_pool = models.ForeignKey(
        "number_pool.NumberPool",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cdrs",
    )

    destination = models.CharField(
        max_length=150,
        blank=True,
        default="",
    )

    prefix = models.CharField(
        max_length=20,
        blank=True,
        default="",
    )

    # =====================================================
    # PROVIDER / RATING
    # =====================================================

    provider = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    buy_rate = models.DecimalField(
        max_digits=10,
        decimal_places=6,
        default=0,
    )

    sell_rate = models.DecimalField(
        max_digits=10,
        decimal_places=6,
        default=0,
    )

    billing_block = models.PositiveIntegerField(
        default=60,
    )

    billable_seconds = models.PositiveIntegerField(
        default=0,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        default=0,
    )

    # =====================================================
    # INVOICE
    # =====================================================

    invoice_status = models.CharField(
        max_length=20,
        choices=(
            ("PENDING", "Pending"),
            ("INVOICED", "Invoiced"),
        ),
        default="PENDING",
    )

    # =====================================================
    # SYSTEM
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "call_records"
        ordering = ["-start_time"]

    def __str__(self):
        return (
            f"{self.caller_number} → "
            f"{self.receiver_number}"
        )