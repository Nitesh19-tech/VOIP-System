from django.contrib import admin

from .models import ProvisionJob


@admin.register(ProvisionJob)
class ProvisionJobAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "sip_account",
        "status",
        "created_at",
        "completed_at",
    )

    list_filter = (
        "status",
    )