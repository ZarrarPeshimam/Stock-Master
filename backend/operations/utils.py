from operations.models import Receipt, Delivery, InternalTransfer
from warehouse.models import Warehouse

def generate_reference(warehouse: Warehouse, operation_type: str) -> str:
    """
    Generate a unique reference for an operation.
    Format: {WarehouseCode}/{Operation}/{CID}
    Operation: IN (Receipt), OUT (Delivery), INT (Internal Transfer)
    """
    if operation_type == 'IN':
        model = Receipt
        filter_kwargs = {'warehouse': warehouse}
    elif operation_type == 'OUT':
        model = Delivery
        filter_kwargs = {'warehouse': warehouse}
    elif operation_type == 'INT':
        model = InternalTransfer
        filter_kwargs = {'from_warehouse': warehouse}
    else:
        raise ValueError('Invalid operation type')

    # Count existing operations for this warehouse and type
    count = model.objects.filter(**filter_kwargs).count() + 1
    cid = str(count).zfill(4)
    ref = f"{warehouse.code}/{operation_type}/{cid}"
    return ref
