from django.contrib import admin

from .models import Carrier, CarrierIP


class CarrierIPInline(admin.TabularInline):
    model = CarrierIP
    extra = 1


@admin.register(Carrier)
class CarrierAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
    )

    list_filter = (
        "is_active",
    )

    inlines = [
        CarrierIPInline,
    ]


@admin.register(CarrierIP)
class CarrierIPAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "carrier",
        "ip_address",
        "is_active",
    )

    search_fields = (
        "ip_address",
    )

    list_filter = (
        "carrier",
        "is_active",
    )