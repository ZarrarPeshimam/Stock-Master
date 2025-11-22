from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Warehouse, SubLocation
from .serializers import WarehouseSerializer, SubLocationSerializer


# ---------------------------------------------------
# WAREHOUSE VIEWS
# ---------------------------------------------------

class WarehouseCreateView(generics.CreateAPIView):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]


class WarehouseListView(generics.ListAPIView):
    queryset = Warehouse.objects.all().order_by('name')
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]


class WarehouseDetailView(generics.RetrieveAPIView):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]


# ---------------------------------------------------
# SUB-LOCATION VIEWS
# ---------------------------------------------------

class SubLocationCreateView(generics.CreateAPIView):
    queryset = SubLocation.objects.all()
    serializer_class = SubLocationSerializer
    permission_classes = [IsAuthenticated]


class SubLocationListView(generics.ListAPIView):
    queryset = SubLocation.objects.all()
    serializer_class = SubLocationSerializer
    permission_classes = [IsAuthenticated]


class SubLocationByWarehouseView(generics.ListAPIView):
    serializer_class = SubLocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        warehouse_id = self.kwargs['warehouse_id']
        return SubLocation.objects.filter(warehouse_id=warehouse_id).order_by('aisle', 'rack', 'bin')
