from django.contrib import admin
from .models import Receipt, Delivery, InternalTransfer, StockAdjustment, MoveHistory

# Register your models here.

@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = ('reference', 'warehouse', 'supplier', 'date', 'validated', 'created_at')
    list_filter = ('validated', 'warehouse', 'date', 'created_at')
    search_fields = ('reference', 'supplier', 'warehouse__name')
    readonly_fields = ('reference', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('reference', 'warehouse', 'supplier', 'date')
        }),
        ('Details', {
            'fields': ('notes', 'validated'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('reference', 'warehouse', 'customer', 'date', 'validated', 'created_at')
    list_filter = ('validated', 'warehouse', 'date', 'created_at')
    search_fields = ('reference', 'customer', 'warehouse__name')
    readonly_fields = ('reference', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('reference', 'warehouse', 'customer', 'date')
        }),
        ('Details', {
            'fields': ('notes', 'validated'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(InternalTransfer)
class InternalTransferAdmin(admin.ModelAdmin):
    list_display = ('reference', 'from_warehouse', 'to_warehouse', 'date', 'validated', 'created_at')
    list_filter = ('validated', 'from_warehouse', 'to_warehouse', 'date', 'created_at')
    search_fields = ('reference', 'from_warehouse__name', 'to_warehouse__name')
    readonly_fields = ('reference', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('reference', 'from_warehouse', 'to_warehouse', 'date')
        }),
        ('Details', {
            'fields': ('notes', 'validated'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StockAdjustment)
class StockAdjustmentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'product', 'location', 'counted_quantity', 'adjustment_type', 'date', 'created_at')
    list_filter = ('adjustment_type', 'date', 'created_at')
    search_fields = ('reference', 'product__name', 'location__code')
    readonly_fields = ('reference', 'created_at')
    fieldsets = (
        ('Adjustment Details', {
            'fields': ('reference', 'product', 'location', 'counted_quantity', 'adjustment_type', 'reason', 'date')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(MoveHistory)
class MoveHistoryAdmin(admin.ModelAdmin):
    list_display = ('operation_reference', 'product', 'from_location', 'to_location', 'quantity', 'move_type', 'date')
    list_filter = ('move_type', 'date', 'product', 'from_location', 'to_location')
    search_fields = ('operation_reference', 'product__name')
    readonly_fields = ('date',)
    fieldsets = (
        ('Move Information', {
            'fields': ('operation_reference', 'product', 'from_location', 'to_location', 'quantity', 'move_type')
        }),
        ('Timestamps', {
            'fields': ('date',),
            'classes': ('collapse',)
        }),
    )
