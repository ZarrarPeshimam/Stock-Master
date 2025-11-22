from rest_framework import serializers
from .models import Stock, Warehouse, SubLocation


class WarehouseSerializer(serializers.ModelSerializer):
    coordinates = serializers.ReadOnlyField()
    google_maps_link = serializers.ReadOnlyField()

    class Meta:
        model = Warehouse
        fields = [
            'id',
            'name',
            'code',
            'latitude',
            'longitude',
            'address',
            'city',
            'state',
            'country',
            'pincode',
            'capacity_value',
            'capacity_unit',
            'is_active',
            'created_at',
            'updated_at',
            'coordinates',
            'google_maps_link',
        ]
        read_only_fields = ('created_at', 'updated_at')

class SubLocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubLocation
        fields = [
            'id',
            'warehouse',
            'aisle',
            'rack',
            'bin',
            'code',
            'created_at'
        ]
        read_only_fields = ('code', 'created_at')

    def validate(self, attrs):
        """
        Ensure at least ONE of aisle, rack, bin is provided.
        """
        if not attrs.get('aisle') and not attrs.get('rack') and not attrs.get('bin'):
            raise serializers.ValidationError(
                "At least one of 'aisle', 'rack', or 'bin' must be provided."
            )
        return attrs

    def create(self, validated_data):
        """
        Let model auto-generate absolute code.
        """
        sublocation = SubLocation.objects.create(**validated_data)
        return sublocation

    def update(self, instance, validated_data):
        """
        Updating auto-regenerates the code again.
        """
        instance.aisle = validated_data.get('aisle', instance.aisle)
        instance.rack = validated_data.get('rack', instance.rack)
        instance.bin = validated_data.get('bin', instance.bin)
        instance.warehouse = validated_data.get('warehouse', instance.warehouse)
        instance.save()
        return instance


# ------------------------------
# LIGHTWEIGHT LIST VIEW
# ------------------------------
class StockListSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_sku = serializers.ReadOnlyField(source='product.sku')
    sublocation_code = serializers.ReadOnlyField(source='sublocation.code')

    class Meta:
        model = Stock
        fields = [
            'id',
            'product_name',
            'product_sku',
            'quantity',
            'sublocation_code',
        ]


# ------------------------------
# DETAILED VIEW (ONE STOCK)
# ------------------------------
class StockDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    sublocation = serializers.SerializerMethodField()
    warehouse = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = [
            'id',
            'product',
            'warehouse',
            'sublocation',
            'quantity',
            'updated_at'
        ]

    def get_product(self, obj):
        return {
            "id": obj.product.id,
            "name": obj.product.name,
            "sku": obj.product.sku,
            "category": obj.product.category,
            "type": obj.product.type,
            "weight": obj.product.weight,
            "image": obj.product.image.url if obj.product.image else None
        }

    def get_warehouse(self, obj):
        wh = obj.sublocation.warehouse
        return {
            "id": wh.id,
            "name": wh.name,
            "code": wh.code,
            "city": wh.city,
            "address": wh.address,
        }

    def get_sublocation(self, obj):
        sl = obj.sublocation
        return {
            "id": sl.id,
            "code": sl.code,
            "aisle": sl.aisle,
            "rack": sl.rack,
            "bin": sl.bin,
        }