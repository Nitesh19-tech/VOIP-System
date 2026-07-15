from django.contrib import admin

from .models import Route


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):

    list_display = (
        "routing_plan",
        "prefix",
        "termination",
        "priority",
        "is_active",
    )

    list_filter = (
        "routing_plan",
        "termination",
        "is_active",
    )

    search_fields = (
        "prefix",
        "termination__name",
        "routing_plan__name",
    )

    ordering = (
        "routing_plan",
        "priority",
    )