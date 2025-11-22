from django.contrib import admin
from .models import Warehouse, SubLocation


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'state', 'country', 'is_active', 'created_at')
    list_filter = ('is_active', 'country', 'state', 'created_at')
    search_fields = ('name', 'code', 'city', 'state', 'address')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'is_active')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'country', 'pincode', 'latitude', 'longitude')
        }),
        ('Capacity', {
            'fields': ('capacity_value', 'capacity_unit'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SubLocation)
class SubLocationAdmin(admin.ModelAdmin):
    list_display = ('code', 'warehouse', 'aisle', 'rack', 'bin', 'created_at')
    list_filter = ('warehouse', 'created_at')
    search_fields = ('code', 'aisle', 'rack', 'bin', 'warehouse__name')
    readonly_fields = ('code', 'created_at')
    fieldsets = (
        ('Location Information', {
            'fields': ('warehouse', 'aisle', 'rack', 'bin', 'code')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
