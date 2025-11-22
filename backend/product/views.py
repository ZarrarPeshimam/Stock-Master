
import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer
from warehouse.models import Stock, SubLocation
from warehouse.serializers import StockListSerializer
from rest_framework.views import APIView
# GET /api/product/<id>/stock/ - Get stock per location
class ProductStockPerLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        product = Product.objects.filter(pk=pk).first()
        if not product:
            return Response({'success': False, 'error': 'Product not found'}, status=404)
        stock_qs = Stock.objects.filter(product=product)
        data = []
        for stock in stock_qs.select_related('sublocation__warehouse'):
            data.append({
                'location_id': stock.sublocation.id,
                'location_code': stock.sublocation.code,
                'warehouse': stock.sublocation.warehouse.name,
                'quantity': stock.quantity
            })
        return Response({'success': True, 'product': product.name, 'stock_per_location': data})

# GET /api/categories/ - List categories
class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Product.CATEGORY_CHOICES
        return Response({'success': True, 'categories': [{'key': k, 'label': v} for k, v in categories]})

# GET /api/product/low-stock/ - Get low stock items
class LowStockProductListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        threshold = float(request.query_params.get('threshold', 10))
        low_stock = (
            Stock.objects.values('product')
            .annotate(total_qty=models.Sum('quantity'))
            .filter(total_qty__lte=threshold)
        )
        product_ids = [item['product'] for item in low_stock]
        products = Product.objects.filter(id__in=product_ids)
        serializer = ProductListSerializer(products, many=True)
        return Response({'success': True, 'low_stock_products': serializer.data})

# Get logger for this module
logger = logging.getLogger(__name__)

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductDetailSerializer   # full data for creation
        return ProductListSerializer        # minimal list

    def get(self, request, *args, **kwargs):
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        logger.info(f"[PRODUCT] GET request - List products by user: {getattr(user, 'username', 'Anonymous')} (ID: {getattr(user, 'id', 'N/A')}), IP: {ip_address}")
        products = self.get_queryset()
        serializer = self.get_serializer(products, many=True)
        logger.info(f"[PRODUCT] SUCCESS - Retrieved {products.count()} products")
        return Response({
            'success': True,
            'count': products.count(),
            'products': serializer.data
        })

    def post(self, request, *args, **kwargs):
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        product_name = request.data.get('name', 'Unknown')
        logger.info(f"[PRODUCT] POST request - Create product: {product_name} by user: {getattr(user, 'username', 'Anonymous')} (ID: {getattr(user, 'id', 'N/A')}), IP: {ip_address}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            logger.info(f"[PRODUCT] SUCCESS - Product created: {product.name} (ID: {product.id})")
            return Response({
                'success': True,
                'message': 'Product created successfully',
                'product': serializer.data
            }, status=status.HTTP_201_CREATED)
        logger.warning(f"[PRODUCT] FAILED - Validation errors for product: {product_name}, Errors: {serializer.errors}")
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class ProductRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        product = self.get_object()
        logger.info(f"[PRODUCT] GET request - Product details: {product.name} (ID: {product.id}) by user: {getattr(user, 'username', 'Anonymous')} (ID: {getattr(user, 'id', 'N/A')}), IP: {ip_address}")
        serializer = self.get_serializer(product)
        return Response({
            'success': True,
            'product': serializer.data
        })

    def put(self, request, *args, **kwargs):
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        product = self.get_object()
        logger.info(f"[PRODUCT] PUT request - Update product: {product.name} (ID: {product.id}) by user: {getattr(user, 'username', 'Anonymous')} (ID: {getattr(user, 'id', 'N/A')}), IP: {ip_address}")
        serializer = self.get_serializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"[PRODUCT] SUCCESS - Product updated: {product.name} (ID: {product.id})")
            return Response({
                'success': True,
                'message': 'Product updated successfully',
                'product': serializer.data
            })
        logger.warning(f"[PRODUCT] FAILED - Validation errors for product: {product.name}, Errors: {serializer.errors}")
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        product = self.get_object()
        logger.info(f"[PRODUCT] PATCH request - Partial update product: {product.name} (ID: {product.id}) by user: {getattr(user, 'username', 'Anonymous')} (ID: {getattr(user, 'id', 'N/A')}), IP: {ip_address}")
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"[PRODUCT] SUCCESS - Product partially updated: {product.name} (ID: {product.id})")
            return Response({
                'success': True,
                'message': 'Product updated successfully',
                'product': serializer.data
            })
        logger.warning(f"[PRODUCT] FAILED - Validation errors for product: {product.name}, Errors: {serializer.errors}")
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        product = self.get_object()
        logger.info(f"[PRODUCT] DELETE request - Delete product: {product.name} (ID: {product.id}) by user: {getattr(user, 'username', 'Anonymous')} (ID: {getattr(user, 'id', 'N/A')}), IP: {ip_address}")
        product.delete()
        logger.info(f"[PRODUCT] SUCCESS - Product deleted: {product.name} (ID: {product.id})")
        return Response({
            'success': True,
            'message': 'Product deleted successfully'
        }, status=status.HTTP_200_OK)
