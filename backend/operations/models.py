# operations/models.py
from django.db import models
from django.contrib.auth.models import User
from warehouse.models import Warehouse, SubLocation
from product.models import Product


class Receipt(models.Model):
    reference = models.CharField(max_length=50, unique=True)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    supplier = models.CharField(max_length=200)
    date = models.DateField()
    notes = models.TextField(blank=True)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Receipt {self.reference}"


class ReceiptItem(models.Model):
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    location = models.ForeignKey(SubLocation, on_delete=models.CASCADE)
    quantity = models.FloatField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Delivery(models.Model):
    reference = models.CharField(max_length=50, unique=True)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    customer = models.CharField(max_length=200)
    date = models.DateField()
    notes = models.TextField(blank=True)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery {self.reference}"


class DeliveryItem(models.Model):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    location = models.ForeignKey(SubLocation, on_delete=models.CASCADE)
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class InternalTransfer(models.Model):
    reference = models.CharField(max_length=50, unique=True)
    from_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='transfers_out')
    to_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='transfers_in')
    date = models.DateField()
    notes = models.TextField(blank=True)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transfer {self.reference}"


class TransferItem(models.Model):
    transfer = models.ForeignKey(InternalTransfer, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    from_location = models.ForeignKey(SubLocation, on_delete=models.CASCADE, related_name='transfers_out')
    to_location = models.ForeignKey(SubLocation, on_delete=models.CASCADE, related_name='transfers_in')
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class StockAdjustment(models.Model):
    ADJUSTMENT_TYPE_CHOICES = [
        ('COUNT', 'Physical Count'),
        ('DAMAGE', 'Damage/Loss'),
        ('GAIN', 'Gain/Found'),
        ('OTHER', 'Other'),
    ]

    reference = models.CharField(max_length=50, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    location = models.ForeignKey(SubLocation, on_delete=models.CASCADE)
    counted_quantity = models.FloatField()
    adjustment_type = models.CharField(max_length=20, choices=ADJUSTMENT_TYPE_CHOICES, default='COUNT')
    reason = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Adjustment {self.reference}"


class MoveHistory(models.Model):
    MOVE_TYPE_CHOICES = [
        ('IN', 'Receipt'),
        ('OUT', 'Delivery'),
        ('INTERNAL', 'Internal Transfer'),
        ('ADJUSTMENT', 'Stock Adjustment'),
    ]

    operation_reference = models.CharField(max_length=50)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    from_location = models.ForeignKey(SubLocation, on_delete=models.SET_NULL, null=True, blank=True, related_name='moves_out')
    to_location = models.ForeignKey(SubLocation, on_delete=models.SET_NULL, null=True, blank=True, related_name='moves_in')
    quantity = models.FloatField()
    move_type = models.CharField(max_length=20, choices=MOVE_TYPE_CHOICES)
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.move_type} {self.operation_reference}"
