# operations/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import HttpResponse
from .models import Receipt, Delivery, InternalTransfer, StockAdjustment, MoveHistory
from .serializers import (
    ReceiptSerializer, DeliverySerializer, InternalTransferSerializer,
    StockAdjustmentSerializer, MoveHistorySerializer
)
from .services import increase_stock_on_receipt, decrease_stock_on_delivery, transfer_stock_on_internal_transfer, adjust_stock_on_adjustment
from .utils import generate_reference, generate_receipt_pdf, generate_delivery_pdf
import logging

logger = logging.getLogger(__name__)

# Receipts
class ReceiptListCreateView(generics.ListCreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'warehouse', 'validated']
    search_fields = ['reference', 'supplier']
    ordering_fields = ['created_at', 'schedule_date']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        receipt = serializer.save()
        # Generate reference after creation
        receipt.reference = generate_reference(receipt.warehouse, 'IN')
        receipt.save()

class ReceiptDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]

class ReceiptValidateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            receipt = Receipt.objects.get(pk=pk)
            if receipt.validated:
                return Response({'error': 'Receipt already validated'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate receipt
            increase_stock_on_receipt(receipt, request.user)
            receipt.validated = True
            receipt.save()
            
            logger.info(f"Receipt {receipt.reference} validated by {request.user.username}")
            return Response({'message': 'Receipt validated successfully'})
        except Receipt.DoesNotExist:
            return Response({'error': 'Receipt not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error validating receipt {pk}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ReceiptPrintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            receipt = Receipt.objects.get(pk=pk)
            pdf_buffer = generate_receipt_pdf(receipt)

            response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="receipt_{receipt.reference}.pdf"'
            logger.info(f"PDF generated for receipt {receipt.reference} by {request.user.username}")
            return response
        except Receipt.DoesNotExist:
            return Response({'error': 'Receipt not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error generating PDF for receipt {pk}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Deliveries
class DeliveryListCreateView(generics.ListCreateAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'warehouse', 'validated']
    search_fields = ['reference', 'contact']
    ordering_fields = ['created_at', 'schedule_date']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        delivery = serializer.save()
        delivery.reference = generate_reference(delivery.warehouse, 'OUT')
        delivery.save()

class DeliveryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

class DeliveryValidateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            delivery = Delivery.objects.get(pk=pk)
            if delivery.validated:
                return Response({'error': 'Delivery already validated'}, status=status.HTTP_400_BAD_REQUEST)
            
            decrease_stock_on_delivery(delivery, request.user)
            delivery.validated = True
            delivery.save()
            
            logger.info(f"Delivery {delivery.reference} validated by {request.user.username}")
            return Response({'message': 'Delivery validated successfully'})
        except Delivery.DoesNotExist:
            return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error validating delivery {pk}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeliveryPrintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            delivery = Delivery.objects.get(pk=pk)
            pdf_buffer = generate_delivery_pdf(delivery)

            response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="delivery_{delivery.reference}.pdf"'
            logger.info(f"PDF generated for delivery {delivery.reference} by {request.user.username}")
            return response
        except Delivery.DoesNotExist:
            return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error generating PDF for delivery {pk}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Internal Transfers
class TransferListCreateView(generics.ListCreateAPIView):
    queryset = InternalTransfer.objects.all()
    serializer_class = InternalTransferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'from_warehouse', 'to_warehouse', 'validated']
    search_fields = ['reference']
    ordering_fields = ['created_at', 'schedule_date']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        transfer = serializer.save()
        transfer.reference = generate_reference(transfer.from_warehouse, 'INT')
        transfer.save()

class TransferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InternalTransfer.objects.all()
    serializer_class = InternalTransferSerializer
    permission_classes = [IsAuthenticated]

class TransferValidateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            transfer = InternalTransfer.objects.get(pk=pk)
            if transfer.validated:
                return Response({'error': 'Transfer already validated'}, status=status.HTTP_400_BAD_REQUEST)
            
            transfer_stock_on_internal_transfer(transfer, request.user)
            transfer.validated = True
            transfer.save()
            
            logger.info(f"Transfer {transfer.reference} validated by {request.user.username}")
            return Response({'message': 'Transfer validated successfully'})
        except InternalTransfer.DoesNotExist:
            return Response({'error': 'Transfer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error validating transfer {pk}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Stock Adjustments
class AdjustmentListCreateView(generics.ListCreateAPIView):
    queryset = StockAdjustment.objects.all()
    serializer_class = StockAdjustmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        adjustment = serializer.save()
        adjustment.reference = f"ADJ-{adjustment.id:04d}"
        adjustment.save()
        # Adjust stock immediately
        adjust_stock_on_adjustment(adjustment, self.request.user)

class AdjustmentDetailView(generics.RetrieveAPIView):
    queryset = StockAdjustment.objects.all()
    serializer_class = StockAdjustmentSerializer
    permission_classes = [IsAuthenticated]

# Move History
class MoveHistoryListView(generics.ListAPIView):
    queryset = MoveHistory.objects.all()
    serializer_class = MoveHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['move_type', 'product', 'from_location', 'to_location']
    search_fields = ['operation_reference']
    ordering_fields = ['date']
    ordering = ['-date']

class MoveHistoryDetailView(generics.RetrieveAPIView):
    queryset = MoveHistory.objects.all()
    serializer_class = MoveHistorySerializer
    permission_classes = [IsAuthenticated]
