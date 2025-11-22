from django.urls import path
from .views import (
    TransferCreateAPIView,
    TransferListAPIView,
    TransferDetailAPIView,
)

app_name = "stock_transfer"

urlpatterns = [
    # Create a transfer
    path("create/", TransferCreateAPIView.as_view(), name="transfer-create"),

    # List all transfers (with optional ?type=FILTER)
    path("list/", TransferListAPIView.as_view(), name="transfer-list"),

    # Detail view for a single transfer
    path("<int:id>/", TransferDetailAPIView.as_view(), name="transfer-detail"),
]
