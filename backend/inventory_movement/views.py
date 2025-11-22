# transfers/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import StockTransfer
from .serializers import (
    StockTransferCreateSerializer,
    StockTransferListSerializer,
    StockTransferDetailSerializer
)
from warehouse.models import SubLocation, Stock


# ---------------------------------------------------------
# 1. CREATE TRANSFER
# ---------------------------------------------------------
class StockTransferCreateAPIView(generics.CreateAPIView):
    serializer_class = StockTransferCreateSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        transfer_type = data.get("transfer_type")
        stock_id = data.get("stock_id")
        dest_stock_id = data.get("destination_stock_id")
        quantity = float(data.get("quantity", 0))

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than 0"}, status=400)

        source_stock = get_object_or_404(Stock, id=stock_id)
        product = source_stock.product
        source_sublocation = source_stock.sublocation
        source_warehouse = source_sublocation.warehouse

        # ------------------ Warehouse → Warehouse ------------------
        if transfer_type == "WAREHOUSE_TO_WAREHOUSE":
            if not dest_stock_id:
                return Response({"error": "Destination stock required"}, status=400)

            dest_stock = get_object_or_404(Stock, id=dest_stock_id)
            dest_sublocation = dest_stock.sublocation
            dest_warehouse = dest_sublocation.warehouse

            if source_stock.quantity < quantity:
                return Response({"error": "Not enough stock in source warehouse"}, status=400)

            # Perform transfer
            source_stock.quantity -= quantity
            dest_stock.quantity += quantity
            source_stock.save()
            dest_stock.save()

        # ------------------ Vendor → Warehouse ------------------
        elif transfer_type == "VENDOR_TO_WAREHOUSE":
            if not dest_stock_id:
                return Response({"error": "Destination stock required"}, status=400)

            dest_stock = get_object_or_404(Stock, id=dest_stock_id)
            dest_stock.quantity += quantity
            dest_stock.save()

        # ------------------ Warehouse → Customer / Production ------------------
        elif transfer_type in ["WAREHOUSE_TO_CUSTOMER", "WAREHOUSE_TO_PRODUCTION"]:
            if source_stock.quantity < quantity:
                return Response({"error": "Not enough stock in source warehouse"}, status=400)

            source_stock.quantity -= quantity
            source_stock.save()

        else:
            return Response({"error": "Invalid transfer type"}, status=400)

        # Save the transfer record
        serializer = StockTransferDetailSerializer(data={
            "transfer_type": transfer_type,
            "product": product.id,
            "quantity": quantity,
            "source_stock": source_stock.id,
            "destination_stock": dest_stock.id if dest_stock_id else None,
            "bill_image": data.get("bill_image"),
            "receipt_image": data.get("receipt_image"),
            "notes": data.get("note", "")
        })
        serializer.is_valid(raise_exception=True)
        transfer = serializer.save()

        return Response({
            "message": "Transfer completed successfully",
            "transfer": serializer.data
        }, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------
# 2. LIST TRANSFERS
# ---------------------------------------------------------
class StockTransferListAPIView(generics.ListAPIView):
    serializer_class = StockTransferListSerializer

    def get_queryset(self):
        qs = StockTransfer.objects.all().order_by("-created_at")
        transfer_type = self.request.query_params.get("type")
        if transfer_type:
            qs = qs.filter(transfer_type=transfer_type)
        return qs


# ---------------------------------------------------------
# 3. DETAIL VIEW
# ---------------------------------------------------------
class StockTransferDetailAPIView(generics.RetrieveAPIView):
    queryset = StockTransfer.objects.all()
    serializer_class = StockTransferDetailSerializer
    lookup_field = "id"
