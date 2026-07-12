from django.contrib import admin
from .models import SIPAccount


@admin.register(SIPAccount)
class SIPAccountAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "username",
        "admin",
        "client",
        "number",
        "status",
        "transport",
        "created_at",
    )

    list_filter = (
        "admin",
        "status",
        "transport",
    )

    search_fields = (
        "username",
        "auth_id",
        "client__name",
        "number__did_number",
    )

    ordering = (
        "-created_at",
    )