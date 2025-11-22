from django.urls import path
from .views import (
    WarehouseCreateView, WarehouseListView, WarehouseDetailView,
    SubLocationCreateView, SubLocationListView, SubLocationByWarehouseView
)

urlpatterns = [
    # Warehouse APIs
    path('warehouse/create/', WarehouseCreateView.as_view(), name='warehouse-create'),
    path('warehouse/', WarehouseListView.as_view(), name='warehouse-list'),
    path('warehouse/<int:pk>/', WarehouseDetailView.as_view(), name='warehouse-detail'),

    # SubLocation APIs
    path('sublocation/create/', SubLocationCreateView.as_view(), name='sublocation-create'),
    path('sublocation/', SubLocationListView.as_view(), name='sublocation-list'),
    path('sublocation/warehouse/<int:warehouse_id>/', SubLocationByWarehouseView.as_view(),
         name='sublocation-by-warehouse'),
]
