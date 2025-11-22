from django.urls import path
from .views import NearestAbundantStockAPIView, WarehouseStockPredictionCSVAPIView

urlpatterns = [
    path('nearest-abundant-stock/', NearestAbundantStockAPIView.as_view(), name='nearest-abundant-stock'),
     path("ml/warehouse-stock-csv/", WarehouseStockPredictionCSVAPIView.as_view(), name="warehouse-stock-csv"),
]
