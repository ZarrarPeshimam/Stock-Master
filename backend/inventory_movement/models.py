# transfers/models.py
from django.db import models
from warehouse.models import Stock
from product.models import Product


class StockTransfer(models.Model):

    # Transfer categories
    TRANSFER_TYPE_CHOICES = [
        ("VENDOR_TO_WAREHOUSE", "Vendor → Warehouse"),
        ("WAREHOUSE_TO_WAREHOUSE", "Warehouse → Warehouse"),
        ("WAREHOUSE_TO_CUSTOMER", "Warehouse → Customer/Production"),
    ]

    transfer_type = models.CharField(max_length=50, choices=TRANSFER_TYPE_CHOICES)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.FloatField()

    # Reference stock records directly
    source_stock = models.ForeignKey(
        Stock,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transfer_out"
    )

    destination_stock = models.ForeignKey(
        Stock,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transfer_in"
    )

    # Optional image (receipt / bill)
    document = models.ImageField(
        upload_to="transfer_docs/",
        blank=True,
        null=True
    )

    # Optional note
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        src = f"{self.source_stock.sublocation.code}" if self.source_stock else "Vendor"
        dest = f"{self.destination_stock.sublocation.code}" if self.destination_stock else "Customer"
        return f"{self.product.name}: {src} → {dest} ({self.quantity})"
