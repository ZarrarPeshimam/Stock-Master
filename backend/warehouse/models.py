
# Create your models here.
# inventory/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _


class Warehouse(models.Model):
    name = models.CharField(max_length=200, unique=True, verbose_name=_("Warehouse Name"))
    code = models.CharField(max_length=20, unique=True, blank=True, null=True,
                            help_text=_("e.g. WH-001, MUM-DC, BLR-STORE"))

    # Simple lat/lng - no GeoDjango required
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6,
        null=True, blank=True,
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
        help_text=_("Latitude (-90 to 90)")
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6,
        null=True, blank=True,
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
        help_text=_("Longitude (-180 to 180)")
    )

    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default="India")
    pincode = models.CharField(max_length=20, blank=True)

    # Capacity (optional but looks pro on dashboard)
    capacity_value = models.PositiveIntegerField(null=True, blank=True, help_text=_("Total capacity (any unit)"))
    capacity_unit = models.CharField(max_length=20, default="Units", blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Warehouse"
        verbose_name_plural = "Warehouses"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code or ''})".strip()

    # Nice helper for templates / API
    @property
    def coordinates(self):
        if self.latitude and self.longitude:
            return f"{self.latitude}, {self.longitude}"
        return "Not set"

    @property
    def google_maps_link(self):
        if self.latitude and self.longitude:
            return f"https://www.google.com/maps?q={self.latitude},{self.longitude}"
        return "#"
    
    
class SubLocation(models.Model):
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)

    aisle = models.CharField(max_length=50, blank=True, null=True)
    rack = models.CharField(max_length=50, blank=True, null=True)
    bin = models.CharField(max_length=50, blank=True, null=True)

    # absolute code like A2-R3-B4
    code = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-generate code if not provided
        self.code = "-".join([x for x in [self.aisle, self.rack, self.bin] if x])
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} ({self.warehouse.name})"




class Stock(models.Model):
    product = models.ForeignKey(
        'product.Product',
        on_delete=models.CASCADE,
        related_name="stock_items"
    )

    sublocation = models.ForeignKey(
        SubLocation,
        on_delete=models.CASCADE,
        related_name="stock_items"
    )

    quantity = models.FloatField(default=0)

    # Optional but VERY useful for tracking warehouse ops
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'sublocation')
        verbose_name = "Stock Record"
        verbose_name_plural = "Stock Records"

    def __str__(self):
        return f"{self.product.sku} @ {self.sublocation.code} = {self.quantity}"