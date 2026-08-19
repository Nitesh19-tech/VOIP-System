from rest_framework import serializers

from .models import CallRecord


class CallRecordSerializer(serializers.ModelSerializer):

    # =====================================================
    # SIP EXTENSIONS
    # =====================================================

    caller_extension = serializers.SerializerMethodField()
    receiver_extension = serializers.SerializerMethodField()

    # =====================================================
    # CDR REPORT FIELDS
    # =====================================================

    date = serializers.DateTimeField(
        source="start_time",
        read_only=True,
    )

    carrier = serializers.SerializerMethodField()
    termination = serializers.SerializerMethodField()
    number = serializers.SerializerMethodField()
    cli = serializers.CharField(
        source="caller_number",
        read_only=True,
    )

    currency = serializers.SerializerMethodField()
    payterm = serializers.SerializerMethodField()
    payout = serializers.SerializerMethodField()

    client = serializers.SerializerMethodField()
    client_payterm = serializers.SerializerMethodField()
    client_payout = serializers.SerializerMethodField()

    cause = serializers.CharField(
        source="disposition",
        read_only=True,
    )

    # =====================================================
    # RATING / BILLING
    # =====================================================

    billable_seconds = serializers.IntegerField(
        read_only=True,
    )

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=6,
        read_only=True,
    )

    # =====================================================
    # META
    # =====================================================

    class Meta:
        model = CallRecord

        fields = [

            # ---------------------------------------------
            # BASIC
            # ---------------------------------------------

            "id",

            # ---------------------------------------------
            # REPORT COLUMNS
            # ---------------------------------------------

            "date",
            "carrier",
            "termination",
            "number",
            "cli",
            "currency",
            "duration",
            "payterm",
            "payout",
            "client",
            "client_payterm",
            "client_payout",
            "cause",

            # ---------------------------------------------
            # EXISTING CDR DATA
            # ---------------------------------------------

            "caller",
            "receiver",

            "caller_extension",
            "receiver_extension",

            "caller_number",
            "receiver_number",

            "caller_name",
            "receiver_name",

            "context",
            "application",

            "channel",
            "destination_channel",

            "duration",
            "billsec",

            "disposition",

            "start_time",
            "answer_time",
            "end_time",

            # ---------------------------------------------
            # RATING
            # ---------------------------------------------

            "country",
            "destination",
            "prefix",
            "provider",

            "buy_rate",
            "sell_rate",

            "billing_block",
            "billable_seconds",
            "amount",

            "invoice_status",

            # ---------------------------------------------
            # NUMBER POOL
            # ---------------------------------------------

            "number_pool",

            # ---------------------------------------------
            # SYSTEM
            # ---------------------------------------------

            "created_at",
        ]

    # =====================================================
    # CALLER EXTENSION
    # =====================================================

    def get_caller_extension(self, obj):

        if obj.caller:
            return obj.caller.username

        return None

    # =====================================================
    # RECEIVER EXTENSION
    # =====================================================

    def get_receiver_extension(self, obj):

        if obj.receiver:
            return obj.receiver.username

        return None

    # =====================================================
    # CARRIER
    # =====================================================

    def get_carrier(self, obj):

        if obj.number_pool and obj.number_pool.carrier:
            return obj.number_pool.carrier.name

        return None

    # =====================================================
    # TERMINATION
    # =====================================================

    def get_termination(self, obj):

        if obj.number_pool and obj.number_pool.termination:
            return obj.number_pool.termination.name

        return None

    # =====================================================
    # NUMBER / DID
    # =====================================================

    def get_number(self, obj):

        if obj.number_pool:

            if obj.number_pool.did_number:
                return obj.number_pool.did_number

            if obj.number_pool.number:
                return obj.number_pool.number

        # Fallback for old CDR records
        return obj.receiver_number or None

    # =====================================================
    # CURRENCY
    # =====================================================

    def get_currency(self, obj):

        if obj.number_pool:
            return obj.number_pool.currency or None

        return None

    # =====================================================
    # PAYTERM
    # =====================================================

    def get_payterm(self, obj):

        if obj.number_pool:
            return obj.number_pool.payterm

        return None

    # =====================================================
    # PAYOUT
    # =====================================================

    def get_payout(self, obj):

        if obj.number_pool:
            return obj.number_pool.payout

        return None

    # =====================================================
    # CLIENT
    # =====================================================

    def get_client(self, obj):

        if obj.number_pool and obj.number_pool.client:
            return obj.number_pool.client.name

        return None

    # =====================================================
    # CLIENT PAYTERM
    # =====================================================

    def get_client_payterm(self, obj):

        # Client model currently does not contain
        # a client payterm field.
        return None

    # =====================================================
    # CLIENT PAYOUT
    # =====================================================

    def get_client_payout(self, obj):

        # Client model currently does not contain
        # a client payout field.
        return None