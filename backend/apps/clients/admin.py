from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "admin",
        "email",
        "phone",
        "is_active",
        "created_at",
    )

    list_filter = (
        "admin",
        "is_active",
    )

    search_fields = (
        "name",
        "email",
        "phone",
    )

    ordering = ("-created_at",)