from django.urls import path
from .views import (
    ReceiptListCreateView, ReceiptDetailView, ReceiptValidateView, ReceiptPrintView,
    DeliveryListCreateView, DeliveryDetailView, DeliveryValidateView, DeliveryPrintView,
    TransferListCreateView, TransferDetailView, TransferValidateView,
    AdjustmentListCreateView, AdjustmentDetailView,
    MoveHistoryListView, MoveHistoryDetailView
)

app_name = "operations"

urlpatterns = [
    # Receipts
    path("receipts/", ReceiptListCreateView.as_view(), name="receipt-list-create"),
    path("receipts/<int:pk>/", ReceiptDetailView.as_view(), name="receipt-detail"),
    path("receipts/<int:pk>/validate/", ReceiptValidateView.as_view(), name="receipt-validate"),
    path("receipts/<int:pk>/print/", ReceiptPrintView.as_view(), name="receipt-print"),

    # Deliveries
    path("deliveries/", DeliveryListCreateView.as_view(), name="delivery-list-create"),
    path("deliveries/<int:pk>/", DeliveryDetailView.as_view(), name="delivery-detail"),
    path("deliveries/<int:pk>/validate/", DeliveryValidateView.as_view(), name="delivery-validate"),
    path("deliveries/<int:pk>/print/", DeliveryPrintView.as_view(), name="delivery-print"),

    # Internal Transfers
    path("transfers/", TransferListCreateView.as_view(), name="transfer-list-create"),
    path("transfers/<int:pk>/", TransferDetailView.as_view(), name="transfer-detail"),
    path("transfers/<int:pk>/validate/", TransferValidateView.as_view(), name="transfer-validate"),

    # Stock Adjustments
    path("adjustments/", AdjustmentListCreateView.as_view(), name="adjustment-list-create"),
    path("adjustments/<int:pk>/", AdjustmentDetailView.as_view(), name="adjustment-detail"),

    # Move History
    path("move-history/", MoveHistoryListView.as_view(), name="move-history-list"),
    path("move-history/<int:pk>/", MoveHistoryDetailView.as_view(), name="move-history-detail"),
]
