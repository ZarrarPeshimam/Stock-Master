from django.urls import path
from .views import (
    NearestAbundantStockAPIView,
    DemandPredictionAPIView,
    SuspiciousActivityAPIView,
    ProductRecommendationAPIView,
    WarehouseStockPredictionCSVAPIView
)

urlpatterns = [
    path('nearest-abundant-stock/', NearestAbundantStockAPIView.as_view(), name='nearest-abundant-stock'),
    path('demand-prediction/', DemandPredictionAPIView.as_view(), name='demand-prediction'),
    path('suspicious-activity/', SuspiciousActivityAPIView.as_view(), name='suspicious-activity'),
    path('product-recommendations/', ProductRecommendationAPIView.as_view(), name='product-recommendations'),
    path('warehouse-stock-csv/', WarehouseStockPredictionCSVAPIView.as_view(), name='warehouse-stock-csv'),
]
