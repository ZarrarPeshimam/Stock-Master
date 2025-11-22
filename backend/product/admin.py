from django.contrib import admin
from .models import Product

# Register your models here.

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'category', 'type', 'weight')
    list_filter = ('category', 'type')
    search_fields = ('name', 'sku')
    fieldsets = (
        ('Basic Information', {
            'fields': ('sku', 'name', 'category', 'type')
        }),
        ('Physical Properties', {
            'fields': ('weight', 'image'),
        }),
    )
