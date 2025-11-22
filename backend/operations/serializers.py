# operations/serializers.py
from rest_framework import serializers
from .models import (
    Receipt, ReceiptItem, Delivery, DeliveryItem,
    InternalTransfer, TransferItem, StockAdjustment, MoveHistory
)


class ReceiptItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    location_code = serializers.CharField(source='location.code', read_only=True)

    class Meta:
        model = ReceiptItem
        fields = ['id', 'product', 'product_name', 'location', 'location_code', 'quantity', 'unit_price']


class ReceiptSerializer(serializers.ModelSerializer):
    items = ReceiptItemSerializer(many=True, read_only=True)

    class Meta:
        model = Receipt
        fields = ['id', 'reference', 'warehouse', 'supplier', 'date', 'notes', 'validated', 'items', 'created_at', 'updated_at']
        read_only_fields = ('reference', 'validated', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = self.context['request'].data.get('items', [])
        receipt = Receipt.objects.create(**validated_data)
        for item_data in items_data:
            ReceiptItem.objects.create(receipt=receipt, **item_data)
        return receipt

    def update(self, instance, validated_data):
        items_data = self.context['request'].data.get('items', [])
        instance = super().update(instance, validated_data)
        if items_data:
            instance.items.all().delete()  # Clear existing items
            for item_data in items_data:
                ReceiptItem.objects.create(receipt=instance, **item_data)
        return instance


class DeliveryItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    location_code = serializers.CharField(source='location.code', read_only=True)

    class Meta:
        model = DeliveryItem
        fields = ['id', 'product', 'product_name', 'location', 'location_code', 'quantity']


class DeliverySerializer(serializers.ModelSerializer):
    items = DeliveryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', 'reference', 'warehouse', 'customer', 'date', 'notes', 'validated', 'items', 'created_at', 'updated_at']
        read_only_fields = ('reference', 'validated', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = self.context['request'].data.get('items', [])
        delivery = Delivery.objects.create(**validated_data)
        for item_data in items_data:
            DeliveryItem.objects.create(delivery=delivery, **item_data)
        return delivery

    def update(self, instance, validated_data):
        items_data = self.context['request'].data.get('items', [])
        instance = super().update(instance, validated_data)
        if items_data:
            instance.items.all().delete()
            for item_data in items_data:
                DeliveryItem.objects.create(delivery=instance, **item_data)
        return instance


class TransferItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    from_location_code = serializers.CharField(source='from_location.code', read_only=True)
    to_location_code = serializers.CharField(source='to_location.code', read_only=True)

    class Meta:
        model = TransferItem
        fields = ['id', 'product', 'product_name', 'from_location', 'from_location_code', 'to_location', 'to_location_code', 'quantity']


class InternalTransferSerializer(serializers.ModelSerializer):
    items = TransferItemSerializer(many=True, read_only=True)

    class Meta:
        model = InternalTransfer
        fields = ['id', 'reference', 'from_warehouse', 'to_warehouse', 'date', 'notes', 'validated', 'items', 'created_at', 'updated_at']
        read_only_fields = ('reference', 'validated', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = self.context['request'].data.get('items', [])
        transfer = InternalTransfer.objects.create(**validated_data)
        for item_data in items_data:
            TransferItem.objects.create(transfer=transfer, **item_data)
        return transfer

    def update(self, instance, validated_data):
        items_data = self.context['request'].data.get('items', [])
        instance = super().update(instance, validated_data)
        if items_data:
            instance.items.all().delete()
            for item_data in items_data:
                TransferItem.objects.create(transfer=instance, **item_data)
        return instance


class StockAdjustmentSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    location_code = serializers.CharField(source='location.code', read_only=True)

    class Meta:
        model = StockAdjustment
        fields = ['id', 'reference', 'product', 'product_name', 'location', 'location_code', 'counted_quantity', 'adjustment_type', 'reason', 'date', 'created_at']


class MoveHistorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    from_location_code = serializers.CharField(source='from_location.code', read_only=True, allow_null=True)
    to_location_code = serializers.CharField(source='to_location.code', read_only=True, allow_null=True)
    user_username = serializers.CharField(source='user.username', read_only=True, allow_null=True)

    class Meta:
        model = MoveHistory
        fields = ['id', 'operation_reference', 'product', 'product_name', 'from_location', 'from_location_code', 'to_location', 'to_location_code', 'quantity', 'move_type', 'date', 'user', 'user_username']
