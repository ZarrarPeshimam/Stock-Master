
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from warehouse.models import Stock
from product.models import Product
from operations.models import Receipt, Delivery, InternalTransfer
from django.db.models import Sum, Q

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
		# Example: filter by date range, warehouse, product, etc.
		# For now, just return a placeholder
		return Response({
			'success': True,
			'statistics': 'Statistics endpoint not yet implemented. Add filters as needed.'
		})
