from rest_framework import serializers
from .models import Transfer


# ---------------------------------------------------------
# 1. LIST SERIALIZER  (Minimal fields for list view)
# ---------------------------------------------------------
class TransferListSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = Transfer
        fields = [
            "id",
            "transfer_type",
            "product_name",
            "product_sku",
            "quantity",
            "created_at",
        ]


# ---------------------------------------------------------
# 2. DETAIL SERIALIZER  (Full details for single transfer)
# ---------------------------------------------------------
class TransferDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    destination = serializers.SerializerMethodField()

    class Meta:
        model = Transfer
        fields = "__all__"

    def get_product(self, obj):
        return {
            "name": obj.product.name,
            "sku": obj.product.sku,
            "category": obj.product.category,
            "type": obj.product.type,
            "weight": obj.product.weight,
            "image": obj.product.image.url if obj.product.image else None,
        }

    def get_source(self, obj):
        return {
            "warehouse": obj.source_warehouse.name if obj.source_warehouse else None,
            "sublocation": obj.source_sublocation.code if obj.source_sublocation else None,
        }

    def get_destination(self, obj):
        return {
            "warehouse": obj.destination_warehouse.name if obj.destination_warehouse else None,
            "sublocation": obj.destination_sublocation.code if obj.destination_sublocation else None,
        }


# ---------------------------------------------------------
# 3. CREATE SERIALIZER  (Used for POST requests)
# ---------------------------------------------------------
class TransferCreateSerializer(serializers.Serializer):
    stock_id = serializers.IntegerField()
    transfer_type = serializers.ChoiceField(choices=[
        ('WAREHOUSE_TO_WAREHOUSE', 'Warehouse → Warehouse'),
        ('VENDOR_TO_WAREHOUSE', 'Vendor → Warehouse'),
        ('WAREHOUSE_TO_PRODUCTION', 'Warehouse → Production'),
        ('WAREHOUSE_TO_CUSTOMER', 'Warehouse → Customer'),
    ])

    quantity = serializers.FloatField()

    # Only required for warehouse-to-warehouse transfers
    destination_sublocation = serializers.IntegerField(required=False)

    # Uploadable images
    bill_image = serializers.ImageField(required=False, allow_null=True)
    receipt_image = serializers.ImageField(required=False, allow_null=True)

    # Optional notes/comments
    note = serializers.CharField(required=False, allow_blank=True)
