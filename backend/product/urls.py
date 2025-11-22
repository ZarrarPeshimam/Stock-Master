from django.urls import path

from .views import (
    ProductListCreateView,
    ProductRetrieveUpdateDeleteView,
    ProductStockPerLocationView,
    CategoryListView,
    LowStockProductListView,
)

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductRetrieveUpdateDeleteView.as_view(), name='product-detail'),
    path('<int:pk>/stock/', ProductStockPerLocationView.as_view(), name='product-stock-per-location'),
    path('low-stock/', LowStockProductListView.as_view(), name='product-low-stock'),
    path('categories/', CategoryListView.as_view(), name='product-categories'),
]
