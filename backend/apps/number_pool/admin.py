from django.contrib import admin
from .models import NumberPool


@admin.register(NumberPool)
class NumberPoolAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "did_number",
        "extension",
        "admin",
        "client",
        "status",
        "created_at",
    )

    list_filter = (
        "admin",
        "status",
    )

    search_fields = (
        "did_number",
        "extension",
    )

    ordering = (
        "did_number",
    )