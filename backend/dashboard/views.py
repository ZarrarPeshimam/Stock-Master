
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from warehouse.models import Stock
from product.models import Product
from operations.models import Receipt, Delivery, InternalTransfer
from django.db.models import Sum, Q, Count
from django.utils import timezone
from datetime import timedelta, datetime

class DashboardKPIsView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		# Total products in stock
		total_products_in_stock = Stock.objects.aggregate(total=Sum('quantity'))['total'] or 0
		# Low stock / Out of stock items
		low_stock_threshold = float(request.query_params.get('low_stock_threshold', 10))
		low_stock = (
			Stock.objects.values('product')
			.annotate(total_qty=Sum('quantity'))
			.filter(total_qty__lte=low_stock_threshold)
		)
		out_of_stock = (
			Stock.objects.values('product')
			.annotate(total_qty=Sum('quantity'))
			.filter(total_qty__lte=0)
		)
		# Pending receipts
		pending_receipts = Receipt.objects.filter(validated=False).count()
		# Pending deliveries
		pending_deliveries = Delivery.objects.filter(validated=False).count()
		# Internal transfers scheduled
		scheduled_transfers = InternalTransfer.objects.filter(validated=False).count()
		return Response({
			'success': True,
			'kpis': {
				'total_products_in_stock': total_products_in_stock,
				'low_stock_items': len(low_stock),
				'out_of_stock_items': len(out_of_stock),
				'pending_receipts': pending_receipts,
				'pending_deliveries': pending_deliveries,
				'internal_transfers_scheduled': scheduled_transfers,
			}
		})

class DashboardStatisticsView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		# Get filter parameters
		date_from = request.query_params.get('date_from')
		date_to = request.query_params.get('date_to')
		warehouse_id = request.query_params.get('warehouse')
		product_id = request.query_params.get('product')
		period = request.query_params.get('period', '30d')  # 7d, 30d, 90d, 1y

		# Parse dates
		if date_from:
			try:
				date_from = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
			except ValueError:
				return Response({'success': False, 'error': 'Invalid date_from format. Use ISO format.'}, status=400)
		if date_to:
			try:
				date_to = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
			except ValueError:
				return Response({'success': False, 'error': 'Invalid date_to format. Use ISO format.'}, status=400)

		# Default date range based on period
		if not date_from and not date_to:
			now = timezone.now()
			if period == '7d':
				date_from = now - timedelta(days=7)
			elif period == '30d':
				date_from = now - timedelta(days=30)
			elif period == '90d':
				date_from = now - timedelta(days=90)
			elif period == '1y':
				date_from = now - timedelta(days=365)
			date_to = now

		# Build base querysets with date filtering
		receipts_qs = Receipt.objects.filter(created_at__range=(date_from, date_to))
		deliveries_qs = Delivery.objects.filter(created_at__range=(date_from, date_to))
		transfers_qs = InternalTransfer.objects.filter(created_at__range=(date_from, date_to))

		# Apply warehouse filter if provided
		if warehouse_id:
			receipts_qs = receipts_qs.filter(warehouse_id=warehouse_id)
			deliveries_qs = deliveries_qs.filter(warehouse_id=warehouse_id)
			transfers_qs = transfers_qs.filter(from_warehouse_id=warehouse_id) | transfers_qs.filter(to_warehouse_id=warehouse_id)

		# Apply product filter if provided
		if product_id:
			receipts_qs = receipts_qs.filter(receipt_items__product_id=product_id).distinct()
			deliveries_qs = deliveries_qs.filter(delivery_items__product_id=product_id).distinct()
			transfers_qs = transfers_qs.filter(transfer_items__product_id=product_id).distinct()

		# Calculate statistics
		total_receipts = receipts_qs.count()
		total_deliveries = deliveries_qs.count()
		total_transfers = transfers_qs.count()

		# Value statistics (assuming receipt_items, delivery_items, transfer_items have quantity and unit_price)
		receipts_value = receipts_qs.aggregate(
			total=Sum('receipt_items__quantity') * Sum('receipt_items__unit_price')
		)['total'] or 0

		deliveries_value = deliveries_qs.aggregate(
			total=Sum('delivery_items__quantity') * Sum('delivery_items__unit_price')
		)['total'] or 0

		transfers_value = transfers_qs.aggregate(
			total=Sum('transfer_items__quantity') * Sum('transfer_items__unit_price')
		)['total'] or 0

		# Stock levels
		stock_qs = Stock.objects.all()
		if warehouse_id:
			stock_qs = stock_qs.filter(sublocation__warehouse_id=warehouse_id)
		if product_id:
			stock_qs = stock_qs.filter(product_id=product_id)

		total_stock_value = stock_qs.aggregate(
			total=Sum('quantity') * Sum('product__unit_price')
		)['total'] or 0

		total_stock_quantity = stock_qs.aggregate(total=Sum('quantity'))['total'] or 0

		# Top products by movement
		top_products_receipts = receipts_qs.values('receipt_items__product__name').annotate(
			total_qty=Sum('receipt_items__quantity')
		).order_by('-total_qty')[:5]

		top_products_deliveries = deliveries_qs.values('delivery_items__product__name').annotate(
			total_qty=Sum('delivery_items__quantity')
		).order_by('-total_qty')[:5]

		return Response({
			'success': True,
			'filters_applied': {
				'date_from': date_from.isoformat() if date_from else None,
				'date_to': date_to.isoformat() if date_to else None,
				'warehouse_id': warehouse_id,
				'product_id': product_id,
				'period': period
			},
			'statistics': {
				'operations': {
					'total_receipts': total_receipts,
					'total_deliveries': total_deliveries,
					'total_transfers': total_transfers,
					'receipts_value': float(receipts_value),
					'deliveries_value': float(deliveries_value),
					'transfers_value': float(transfers_value)
				},
				'stock': {
					'total_quantity': total_stock_quantity,
					'total_value': float(total_stock_value)
				},
				'top_products': {
					'by_receipts': list(top_products_receipts),
					'by_deliveries': list(top_products_deliveries)
				}
			}
		})
