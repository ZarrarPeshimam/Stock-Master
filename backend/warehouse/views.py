import logging
from django.forms import ValidationError
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Stock, Warehouse, SubLocation
from .serializers import StockDetailSerializer, StockListSerializer, WarehouseSerializer, SubLocationSerializer

# Get logger for this module
logger = logging.getLogger(__name__)


# ---------------------------------------------------
# WAREHOUSE VIEWS
# ---------------------------------------------------

class WarehouseListView(generics.ListCreateAPIView):
    """
    List all warehouses or create a new warehouse
    GET: List all warehouses
    POST: Create a new warehouse
    """
    queryset = Warehouse.objects.all().order_by('name')
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['location']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get(self, request):
        """List all warehouses"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        
        logger.info(f"[WAREHOUSE] GET request - List warehouses by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[WAREHOUSE] GET request - List warehouses by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        warehouses = self.get_queryset()
        serializer = self.get_serializer(warehouses, many=True)
        
        logger.info(f"[WAREHOUSE] SUCCESS - Retrieved {warehouses.count()} warehouses")
        print(f"[WAREHOUSE] SUCCESS - Retrieved {warehouses.count()} warehouses")
        
        return Response({
            'success': True,
            'count': warehouses.count(),
            'warehouses': serializer.data
        })

    def post(self, request):
        """Create a new warehouse"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse_name = request.data.get('name', 'Unknown')
        
        logger.info(f"[WAREHOUSE] POST request - Create warehouse: {warehouse_name} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[WAREHOUSE] POST request - Create warehouse: {warehouse_name} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            warehouse = serializer.save()
            
            logger.info(f"[WAREHOUSE] SUCCESS - Warehouse created: {warehouse.name} (ID: {warehouse.id})")
            print(f"[WAREHOUSE] SUCCESS - Warehouse created: {warehouse.name} (ID: {warehouse.id})")
            
            return Response({
                'success': True,
                'message': 'Warehouse created successfully',
                'warehouse': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        logger.warning(f"[WAREHOUSE] FAILED - Validation errors for warehouse: {warehouse_name}, Errors: {serializer.errors}")
        print(f"[WAREHOUSE] FAILED - Validation errors for warehouse: {warehouse_name}, Errors: {serializer.errors}")
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class WarehouseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a warehouse
    GET: Get warehouse details
    PUT: Update warehouse
    PATCH: Partial update warehouse
    DELETE: Delete warehouse
    """
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Retrieve warehouse details"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        
        warehouse = self.get_object()
        
        logger.info(f"[WAREHOUSE] GET request - Warehouse details: {warehouse.name} (ID: {warehouse.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[WAREHOUSE] GET request - Warehouse details: {warehouse.name} (ID: {warehouse.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(warehouse)
        return Response({
            'success': True,
            'warehouse': serializer.data
        })

    def put(self, request, *args, **kwargs):
        """Update warehouse"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse = self.get_object()
        
        logger.info(f"[WAREHOUSE] PUT request - Update warehouse: {warehouse.name} (ID: {warehouse.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[WAREHOUSE] PUT request - Update warehouse: {warehouse.name} (ID: {warehouse.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(warehouse, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            logger.info(f"[WAREHOUSE] SUCCESS - Warehouse updated: {warehouse.name} (ID: {warehouse.id})")
            print(f"[WAREHOUSE] SUCCESS - Warehouse updated: {warehouse.name} (ID: {warehouse.id})")
            
            return Response({
                'success': True,
                'message': 'Warehouse updated successfully',
                'warehouse': serializer.data
            })
        
        logger.warning(f"[WAREHOUSE] FAILED - Validation errors for warehouse: {warehouse.name}, Errors: {serializer.errors}")
        print(f"[WAREHOUSE] FAILED - Validation errors for warehouse: {warehouse.name}, Errors: {serializer.errors}")
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        """Partial update warehouse"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse = self.get_object()
        
        logger.info(f"[WAREHOUSE] PATCH request - Partial update warehouse: {warehouse.name} (ID: {warehouse.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[WAREHOUSE] PATCH request - Partial update warehouse: {warehouse.name} (ID: {warehouse.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(warehouse, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            logger.info(f"[WAREHOUSE] SUCCESS - Warehouse partially updated: {warehouse.name} (ID: {warehouse.id})")
            print(f"[WAREHOUSE] SUCCESS - Warehouse partially updated: {warehouse.name} (ID: {warehouse.id})")
            
            return Response({
                'success': True,
                'message': 'Warehouse updated successfully',
                'warehouse': serializer.data
            })
        
        logger.warning(f"[WAREHOUSE] FAILED - Validation errors for warehouse: {warehouse.name}, Errors: {serializer.errors}")
        print(f"[WAREHOUSE] FAILED - Validation errors for warehouse: {warehouse.name}, Errors: {serializer.errors}")
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """Delete warehouse"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse = self.get_object()
        warehouse_name = warehouse.name
        warehouse_id = warehouse.id
        
        logger.info(f"[WAREHOUSE] DELETE request - Delete warehouse: {warehouse_name} (ID: {warehouse_id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[WAREHOUSE] DELETE request - Delete warehouse: {warehouse_name} (ID: {warehouse_id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        warehouse.delete()
        
        logger.info(f"[WAREHOUSE] SUCCESS - Warehouse deleted: {warehouse_name} (ID: {warehouse_id})")
        print(f"[WAREHOUSE] SUCCESS - Warehouse deleted: {warehouse_name} (ID: {warehouse_id})")
        
        return Response({
            'success': True,
            'message': 'Warehouse deleted successfully'
        }, status=status.HTTP_200_OK)


# ---------------------------------------------------
# SUB-LOCATION VIEWS
# ---------------------------------------------------

class SubLocationListView(generics.ListCreateAPIView):
    """
    List all sub-locations or create a new sub-location
    GET: List all sub-locations
    POST: Create a new sub-location
    """
    queryset = SubLocation.objects.all()
    serializer_class = SubLocationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['warehouse']
    search_fields = ['code']
    ordering_fields = ['code', 'created_at']
    ordering = ['code']

    def get(self, request):
        """List all sub-locations"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        
        logger.info(f"[SUBLOCATION] GET request - List sub-locations by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] GET request - List sub-locations by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        sublocations = self.get_queryset()
        serializer = self.get_serializer(sublocations, many=True)
        
        logger.info(f"[SUBLOCATION] SUCCESS - Retrieved {sublocations.count()} sub-locations")
        print(f"[SUBLOCATION] SUCCESS - Retrieved {sublocations.count()} sub-locations")
        
        return Response({
            'success': True,
            'count': sublocations.count(),
            'sublocations': serializer.data
        })

    def post(self, request):
        """Create a new sub-location"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse_id = request.data.get('warehouse', 'Unknown')
        
        logger.info(f"[SUBLOCATION] POST request - Create sub-location for warehouse: {warehouse_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] POST request - Create sub-location for warehouse: {warehouse_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            sublocation = serializer.save()
            
            logger.info(f"[SUBLOCATION] SUCCESS - Sub-location created: {sublocation.code} (ID: {sublocation.id})")
            print(f"[SUBLOCATION] SUCCESS - Sub-location created: {sublocation.code} (ID: {sublocation.id})")
            
            return Response({
                'success': True,
                'message': 'Sub-location created successfully',
                'sublocation': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        logger.warning(f"[SUBLOCATION] FAILED - Validation errors for sub-location, Errors: {serializer.errors}")
        print(f"[SUBLOCATION] FAILED - Validation errors for sub-location, Errors: {serializer.errors}")
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class SubLocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a sub-location
    GET: Get sub-location details
    PUT: Update sub-location
    PATCH: Partial update sub-location
    DELETE: Delete sub-location
    """
    queryset = SubLocation.objects.all()
    serializer_class = SubLocationSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Retrieve sub-location details"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        sublocation = self.get_object()
        
        logger.info(f"[SUBLOCATION] GET request - Sub-location details: {sublocation.code} (ID: {sublocation.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] GET request - Sub-location details: {sublocation.code} (ID: {sublocation.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(sublocation)
        return Response({
            'success': True,
            'sublocation': serializer.data
        })

    def put(self, request, *args, **kwargs):
        """Update sub-location"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        sublocation = self.get_object()
        
        logger.info(f"[SUBLOCATION] PUT request - Update sub-location: {sublocation.code} (ID: {sublocation.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] PUT request - Update sub-location: {sublocation.code} (ID: {sublocation.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(sublocation, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            logger.info(f"[SUBLOCATION] SUCCESS - Sub-location updated: {sublocation.code} (ID: {sublocation.id})")
            print(f"[SUBLOCATION] SUCCESS - Sub-location updated: {sublocation.code} (ID: {sublocation.id})")
            
            return Response({
                'success': True,
                'message': 'Sub-location updated successfully',
                'sublocation': serializer.data
            })
        
        logger.warning(f"[SUBLOCATION] FAILED - Validation errors for sub-location: {sublocation.code}, Errors: {serializer.errors}")
        print(f"[SUBLOCATION] FAILED - Validation errors for sub-location: {sublocation.code}, Errors: {serializer.errors}")
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        """Partial update sub-location"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        sublocation = self.get_object()
        
        logger.info(f"[SUBLOCATION] PATCH request - Partial update sub-location: {sublocation.code} (ID: {sublocation.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] PATCH request - Partial update sub-location: {sublocation.code} (ID: {sublocation.id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        serializer = self.get_serializer(sublocation, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            logger.info(f"[SUBLOCATION] SUCCESS - Sub-location partially updated: {sublocation.code} (ID: {sublocation.id})")
            print(f"[SUBLOCATION] SUCCESS - Sub-location partially updated: {sublocation.code} (ID: {sublocation.id})")
            
            return Response({
                'success': True,
                'message': 'Sub-location updated successfully',
                'sublocation': serializer.data
            })
        
        logger.warning(f"[SUBLOCATION] FAILED - Validation errors for sub-location: {sublocation.code}, Errors: {serializer.errors}")
        print(f"[SUBLOCATION] FAILED - Validation errors for sub-location: {sublocation.code}, Errors: {serializer.errors}")
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """Delete sub-location"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        sublocation = self.get_object()
        sublocation_code = sublocation.code
        sublocation_id = sublocation.id
        
        logger.info(f"[SUBLOCATION] DELETE request - Delete sub-location: {sublocation_code} (ID: {sublocation_id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] DELETE request - Delete sub-location: {sublocation_code} (ID: {sublocation_id}) by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        sublocation.delete()
        
        logger.info(f"[SUBLOCATION] SUCCESS - Sub-location deleted: {sublocation_code} (ID: {sublocation_id})")
        print(f"[SUBLOCATION] SUCCESS - Sub-location deleted: {sublocation_code} (ID: {sublocation_id})")
        
        return Response({
            'success': True,
            'message': 'Sub-location deleted successfully'
        }, status=status.HTTP_200_OK)


class SubLocationByWarehouseView(generics.ListAPIView):
    """
    List all sub-locations for a specific warehouse
    GET: Get all sub-locations for a warehouse
    """
    serializer_class = SubLocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        warehouse_id = self.kwargs['warehouse_id']
        return SubLocation.objects.filter(warehouse_id=warehouse_id).order_by('aisle', 'rack', 'bin')

    def get(self, request, *args, **kwargs):
        """List sub-locations for a warehouse"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse_id = kwargs['warehouse_id']
        
        logger.info(f"[SUBLOCATION] GET request - List sub-locations for warehouse: {warehouse_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[SUBLOCATION] GET request - List sub-locations for warehouse: {warehouse_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        sublocations = self.get_queryset()
        serializer = self.get_serializer(sublocations, many=True)
        
        logger.info(f"[SUBLOCATION] SUCCESS - Retrieved {sublocations.count()} sub-locations for warehouse: {warehouse_id}")
        print(f"[SUBLOCATION] SUCCESS - Retrieved {sublocations.count()} sub-locations for warehouse: {warehouse_id}")
        
        return Response({
            'success': True,
            'warehouse_id': warehouse_id,
            'count': sublocations.count(),
            'sublocations': serializer.data
        })




# ---------------------------------------------------
# STOCK VIEWS
# ---------------------------------------------------


class StockListView(generics.ListAPIView):
    serializer_class = StockListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'sublocation']
    search_fields = ['product__name']
    ordering_fields = ['quantity', 'updated_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        warehouse_id = self.request.query_params.get('warehouse')

        if not warehouse_id:
            raise ValidationError("warehouse parameter is required, e.g. ?warehouse=1")

        return Stock.objects.filter(
            sublocation__warehouse_id=warehouse_id
        ).select_related("product", "sublocation")

    def get(self, request):
        """List stock for a warehouse"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        warehouse_id = request.query_params.get('warehouse', 'Unknown')
        
        logger.info(f"[STOCK] GET request - List stock for warehouse: {warehouse_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[STOCK] GET request - List stock for warehouse: {warehouse_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        try:
            stocks = self.get_queryset()
            serializer = self.get_serializer(stocks, many=True)
            
            logger.info(f"[STOCK] SUCCESS - Retrieved {stocks.count()} stock records for warehouse: {warehouse_id}")
            print(f"[STOCK] SUCCESS - Retrieved {stocks.count()} stock records for warehouse: {warehouse_id}")
            
            return Response({
                'success': True,
                'warehouse_id': warehouse_id,
                'count': stocks.count(),
                'stocks': serializer.data
            })
        except ValidationError as e:
            logger.warning(f"[STOCK] FAILED - Validation error for warehouse: {warehouse_id}, Error: {e}")
            print(f"[STOCK] FAILED - Validation error for warehouse: {warehouse_id}, Error: {e}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class StockDetailView(generics.RetrieveAPIView):
    queryset = Stock.objects.select_related(
        "product", "sublocation", "sublocation__warehouse"
    )
    serializer_class = StockDetailSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Retrieve stock details"""
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        user = request.user
        stock_id = kwargs['pk']
        
        logger.info(f"[STOCK] GET request - Stock details: {stock_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[STOCK] GET request - Stock details: {stock_id} by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        stock = self.get_object()
        serializer = self.get_serializer(stock)
        
        logger.info(f"[STOCK] SUCCESS - Retrieved stock details for: {stock.product.name} at {stock.sublocation.code}")
        print(f"[STOCK] SUCCESS - Retrieved stock details for: {stock.product.name} at {stock.sublocation.code}")
        
        return Response({
            'success': True,
            'stock': serializer.data
        })