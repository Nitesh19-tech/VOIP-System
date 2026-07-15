from django.contrib import admin

from .models import Route


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "routing_plan",
        "carrier",
        "prefix",
        "priority",
        "is_active",
    )

    list_filter = (
        "routing_plan",
        "carrier",
        "is_active",
    )

    search_fields = (
        "prefix",
        "carrier__name",
        "routing_plan__name",
    )

    ordering = (
        "routing_plan",
        "priority",
    )