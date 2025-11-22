
import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Product
from .serailizer import ProductListSerializer, ProductDetailSerializer

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
