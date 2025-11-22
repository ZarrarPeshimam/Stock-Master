from django.urls import path
from .views import (
    WarehouseListView, WarehouseDetailView,
    SubLocationListView, SubLocationDetailView, SubLocationByWarehouseView
)

app_name = 'warehouse'

urlpatterns = [
    # Warehouse APIs
    path('warehouses/', WarehouseListView.as_view(), name='warehouse-list-create'),
    path('warehouses/<int:pk>/', WarehouseDetailView.as_view(), name='warehouse-detail-update-delete'),

    # SubLocation APIs
    path('sublocations/', SubLocationListView.as_view(), name='sublocation-list-create'),
    path('sublocations/<int:pk>/', SubLocationDetailView.as_view(), name='sublocation-detail-update-delete'),
    path('sublocations/warehouse/<int:warehouse_id>/', SubLocationByWarehouseView.as_view(), name='sublocation-by-warehouse'),
]
