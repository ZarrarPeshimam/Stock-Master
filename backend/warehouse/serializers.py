from rest_framework import serializers
from .models import Warehouse, SubLocation


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
