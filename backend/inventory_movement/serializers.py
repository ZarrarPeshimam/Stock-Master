# transfers/serializers.py
from rest_framework import serializers
from .models import StockTransfer
from warehouse.models import Stock


# ---------------------------------------------------------
# 1. LIST SERIALIZER (Minimal fields for list view)
# ---------------------------------------------------------
class StockTransferListSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_sku = serializers.CharField(source="product.sku", read_only=True)

    source_sublocation = serializers.CharField(source="source_stock.sublocation.code", read_only=True)
    destination_sublocation = serializers.CharField(source="destination_stock.sublocation.code", read_only=True)

    class Meta:
        model = StockTransfer
        fields = [
            "id",
            "transfer_type",
            "product_name",
            "product_sku",
            "quantity",
            "source_sublocation",
            "destination_sublocation",
            "created_at",
        ]


# ---------------------------------------------------------
# 2. DETAIL SERIALIZER (Full details for single transfer)
# ---------------------------------------------------------
class StockTransferDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    destination = serializers.SerializerMethodField()

    class Meta:
        model = StockTransfer
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
        if obj.source_stock:
            return {
                "warehouse": obj.source_stock.sublocation.warehouse.name,
                "sublocation": obj.source_stock.sublocation.code,
            }
        return None

    def get_destination(self, obj):
        if obj.destination_stock:
            return {
                "warehouse": obj.destination_stock.sublocation.warehouse.name,
                "sublocation": obj.destination_stock.sublocation.code,
            }
        return None


# ---------------------------------------------------------
# 3. CREATE SERIALIZER (Used for POST requests)
# ---------------------------------------------------------
class StockTransferCreateSerializer(serializers.Serializer):
    stock_id = serializers.IntegerField()
    transfer_type = serializers.ChoiceField(choices=[
        ('WAREHOUSE_TO_WAREHOUSE', 'Warehouse → Warehouse'),
        ('VENDOR_TO_WAREHOUSE', 'Vendor → Warehouse'),
        ('WAREHOUSE_TO_PRODUCTION', 'Warehouse → Production'),
        ('WAREHOUSE_TO_CUSTOMER', 'Warehouse → Customer'),
    ])
    quantity = serializers.FloatField()
    destination_stock_id = serializers.IntegerField(required=False)

    # Uploadable images
    bill_image = serializers.ImageField(required=False, allow_null=True)
    receipt_image = serializers.ImageField(required=False, allow_null=True)

    # Optional notes/comments
    note = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        quantity = attrs.get("quantity")
        if quantity <= 0:
            raise serializers.ValidationError({"quantity": "Quantity must be greater than 0"})
        return attrs
