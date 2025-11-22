from warehouse.models import Stock, SubLocation
from product.models import Product
from operations.models import Receipt, Delivery, InternalTransfer, StockAdjustment, MoveHistory
from django.db import transaction
from django.utils import timezone

def increase_stock_on_receipt(receipt, user=None):
    """
    Increase stock for all items in a receipt (on validation)
    """
    for item in receipt.items.all():
        stock, _ = Stock.objects.get_or_create(product=item.product, sublocation=item.location)
        stock.quantity += item.quantity
        stock.updated_at = timezone.now()
        stock.save()
        MoveHistory.objects.create(
            operation_reference=receipt.reference,
            product=item.product,
            from_location=None,
            to_location=item.location,
            quantity=item.quantity,
            move_type='IN',
            date=timezone.now(),
            user=user
        )

def decrease_stock_on_delivery(delivery, user=None):
    """
    Decrease stock for all items in a delivery (on validation)
    """
    for item in delivery.items.all():
        stock = Stock.objects.get(product=item.product, sublocation=item.location)
        if stock.quantity < item.quantity:
            raise ValueError(f"Not enough stock for {item.product.name} at {item.location.code}")
        stock.quantity -= item.quantity
        stock.updated_at = timezone.now()
        stock.save()
        MoveHistory.objects.create(
            operation_reference=delivery.reference,
            product=item.product,
            from_location=item.location,
            to_location=None,
            quantity=item.quantity,
            move_type='OUT',
            date=timezone.now(),
            user=user
        )

def transfer_stock_on_internal_transfer(transfer, user=None):
    """
    Transfer stock for all items in an internal transfer (on validation)
    """
    for item in transfer.items.all():
        with transaction.atomic():
            # Decrease from source
            stock_from = Stock.objects.get(product=item.product, sublocation=item.from_location)
            if stock_from.quantity < item.quantity:
                raise ValueError(f"Not enough stock for {item.product.name} at {item.from_location.code}")
            stock_from.quantity -= item.quantity
            stock_from.updated_at = timezone.now()
            stock_from.save()
            # Increase at destination
            stock_to, _ = Stock.objects.get_or_create(product=item.product, sublocation=item.to_location)
            stock_to.quantity += item.quantity
            stock_to.updated_at = timezone.now()
            stock_to.save()
            MoveHistory.objects.create(
                operation_reference=transfer.reference,
                product=item.product,
                from_location=item.from_location,
                to_location=item.to_location,
                quantity=item.quantity,
                move_type='INTERNAL',
                date=timezone.now(),
                user=user
            )

def adjust_stock_on_adjustment(adjustment, user=None):
    """
    Adjust stock at a location to match counted quantity (on adjustment creation)
    """
    stock, _ = Stock.objects.get_or_create(product=adjustment.product, sublocation=adjustment.location)
    difference = adjustment.counted_quantity - stock.quantity
    stock.quantity = adjustment.counted_quantity
    stock.updated_at = timezone.now()
    stock.save()
    MoveHistory.objects.create(
        operation_reference=adjustment.reference,
        product=adjustment.product,
        from_location=None,
        to_location=adjustment.location,
        quantity=difference,
        move_type='ADJUSTMENT',
        date=timezone.now(),
        user=user
    )
