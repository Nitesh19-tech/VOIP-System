from django.contrib import admin

from .models import RoutingPlan


@admin.register(RoutingPlan)
class RoutingPlanAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "is_default",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_default",
        "is_active",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )