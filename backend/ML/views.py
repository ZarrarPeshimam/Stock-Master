from django.shortcuts import render

# Create your views here.
import math
import logging
from warehouse.models import Warehouse, Stock
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

# Get logger for this module
logger = logging.getLogger(__name__)

def find_nearest_abundant_stock(source_warehouse_id, product_id, abundance_min=6):
    """
    Given a source warehouse ID and product ID, find the nearest warehouse with abundant stock.
    """

    try:
        source_wh = Warehouse.objects.get(id=source_warehouse_id)
    except Warehouse.DoesNotExist:
        return None

    # Stocks in other warehouses with abundant quantity
    abundant_stocks = Stock.objects.filter(
        product_id=product_id,
        quantity__gte=abundance_min
    ).exclude(sublocation__warehouse=source_wh)

    if not abundant_stocks.exists():
        return None

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        d_phi = math.radians(lat2 - lat1)
        d_lambda = math.radians(lon2 - lon1)
        a = math.sin(d_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    closest_stock = None
    min_distance = float('inf')

    for stock in abundant_stocks:
        wh = stock.sublocation.warehouse
        if not wh.latitude or not wh.longitude:
            continue
        distance = haversine(
            float(source_wh.latitude),
            float(source_wh.longitude),
            float(wh.latitude),
            float(wh.longitude)
        )
        if distance < min_distance:
            min_distance = distance
            closest_stock = stock

    if closest_stock:
        return {
            "warehouse": closest_stock.sublocation.warehouse.name,
            "sublocation": closest_stock.sublocation.code,
            "stock_quantity": closest_stock.quantity,
            "distance_km": round(min_distance, 2)
        }

    return None



class NearestAbundantStockAPIView(APIView):
    """
    API to find the nearest warehouse with abundant stock for a given product.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        warehouse_id = request.query_params.get("warehouse_id")
        product_id = request.query_params.get("product_id")
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')

        logger.info(f"[NEAREST_STOCK] GET request - User: {user.username}, Warehouse: {warehouse_id}, Product: {product_id}, IP: {ip_address}")

        if not warehouse_id or not product_id:
            logger.warning(f"[NEAREST_STOCK] FAILED - Missing parameters, User: {user.username}")
            return Response({
                'success': False,
                'error': "warehouse_id and product_id are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        result = find_nearest_abundant_stock(warehouse_id, product_id)

        if not result:
            logger.info(f"[NEAREST_STOCK] SUCCESS - No abundant stock found, User: {user.username}")
            return Response({
                'success': True,
                'message': "No abundant stock found in other warehouses"
            }, status=status.HTTP_200_OK)

        logger.info(f"[NEAREST_STOCK] SUCCESS - Found stock, User: {user.username}, Result: {result}")
        return Response({
            'success': True,
            'data': result
        })
    
    
    
    
    
#real
"""
This file contains FAKE / DUMMY ML logic.
The structure is realistic and can be replaced with real ML models later.
"""

import random
import numpy as np


# -------------------------------
#   FAKE API Keys (not real)
# -------------------------------
OPENAI_API_KEY = "sk-test_1289asdasd8129ASDASD-asdasd"
MLFLOW_TRACKING_URI = "https://mlflow-fake-server.com/track/218as89d"


# -------------------------------
#   Dummy Demand Prediction Model
# -------------------------------
class DummyDemandModel:
    def __init__(self):
        self.name = "DemandPredictor-v0.1"

    def predict(self, warehouse_id, product_id):
        """
        Fake demand prediction:
        Returns a number between 1 - 100 representing demand score.
        """
        np.random.seed(int(warehouse_id) + int(product_id))
        return int(np.random.randint(10, 90))


# -------------------------------
#   Dummy Suspicious Activity Model
# -------------------------------
class FakeSuspiciousModel:
    def __init__(self):
        self.name = "AnomalyDetector-v0.3"

    def predict(self, transfer_amount, user_id):
        """
        Fake suspicious logic:
        If transfer > 500 or random anomaly, flag suspicious.
        """
        if transfer_amount > 500:
            return True

        return random.choice([False, False, False, True])  # 25% randomness


# -------------------------------
#   Dummy Recommendation System
# -------------------------------
class FakeRecommendationModel:
    def __init__(self):
        self.name = "RecoEngine-v2.0"

    def recommend(self, user_id):
        """
        Returns 3 random product IDs pretending to be recommendations.
        """
        return random.sample(range(1, 50), 3)


# Create objects (like loading ML models)
demand_model = DummyDemandModel()
susp_model = FakeSuspiciousModel()
reco_model = FakeRecommendationModel()


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .ml_services import demand_model, susp_model, reco_model


# -------------------------------------------
#   Demand Prediction View
# -------------------------------------------
class DemandPredictionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        warehouse_id = request.query_params.get("warehouse_id")
        product_id = request.query_params.get("product_id")
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')

        logger.info(f"[DEMAND_PREDICTION] GET request - User: {user.username}, Warehouse: {warehouse_id}, Product: {product_id}, IP: {ip_address}")

        if not warehouse_id or not product_id:
            logger.warning(f"[DEMAND_PREDICTION] FAILED - Missing parameters, User: {user.username}")
            return Response({
                'success': False,
                'error': "warehouse_id and product_id required"
            }, status=400)

        predicted_demand = demand_model.predict(warehouse_id, product_id)

        logger.info(f"[DEMAND_PREDICTION] SUCCESS - User: {user.username}, Predicted: {predicted_demand}")
        return Response({
            'success': True,
            'data': {
                "warehouse_id": warehouse_id,
                "product_id": product_id,
                "predicted_demand_score": predicted_demand,
                "model_used": demand_model.name
            }
        })
        

# -------------------------------------------
#   Suspicious Activity Detection View
# -------------------------------------------
class SuspiciousActivityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        transfer_amount = request.data.get("transfer_amount")
        user_id = request.data.get("user_id")
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')

        logger.info(f"[SUSPICIOUS_ACTIVITY] POST request - User: {user.username}, Transfer: {transfer_amount}, Target User: {user_id}, IP: {ip_address}")

        if transfer_amount is None or user_id is None:
            logger.warning(f"[SUSPICIOUS_ACTIVITY] FAILED - Missing parameters, User: {user.username}")
            return Response({
                'success': False,
                'error': "transfer_amount and user_id required"
            }, status=400)

        result = susp_model.predict(int(transfer_amount), int(user_id))

        logger.info(f"[SUSPICIOUS_ACTIVITY] SUCCESS - User: {user.username}, Result: {result}")
        return Response({
            'success': True,
            'data': {
                "user_id": user_id,
                "transfer_amount": transfer_amount,
                "is_suspicious": result,
                "model_used": susp_model.name
            }
        })


# -------------------------------------------
#   Product Recommendation View
# -------------------------------------------
class ProductRecommendationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get("user_id")
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')

        logger.info(f"[PRODUCT_RECOMMENDATION] GET request - User: {user.username}, Target User: {user_id}, IP: {ip_address}")

        if not user_id:
            logger.warning(f"[PRODUCT_RECOMMENDATION] FAILED - Missing user_id, User: {user.username}")
            return Response({
                'success': False,
                'error': "user_id required"
            }, status=400)

        recommendations = reco_model.recommend(int(user_id))

        logger.info(f"[PRODUCT_RECOMMENDATION] SUCCESS - User: {user.username}, Recommendations: {recommendations}")
        return Response({
            'success': True,
            'data': {
                "user_id": user_id,
                "recommended_products": recommendations,
                "model_used": reco_model.name
            }
        })


import csv
import os
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from warehouse.models import Stock, Warehouse
from .ml_services import demand_model

# -------------------------------
#   CSV Export with Demand Prediction
# -------------------------------
class WarehouseStockPredictionCSVAPIView(APIView):
    """
    Generates a CSV for a given warehouse with:
    - Product SKU
    - Product Name
    - Current Stock Quantity
    - Predicted demand score for this year
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        warehouse_id = request.query_params.get("warehouse_id")
        product_ids = request.query_params.getlist("product_ids")  # ?product_ids=1&product_ids=2
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')

        logger.info(f"[WAREHOUSE_CSV] GET request - User: {user.username}, Warehouse: {warehouse_id}, Products: {product_ids}, IP: {ip_address}")

        if not warehouse_id:
            logger.warning(f"[WAREHOUSE_CSV] FAILED - Missing warehouse_id, User: {user.username}")
            return Response({
                'success': False,
                'error': "warehouse_id is required"
            }, status=400)

        try:
            warehouse = Warehouse.objects.get(id=warehouse_id)
        except Warehouse.DoesNotExist:
            logger.warning(f"[WAREHOUSE_CSV] FAILED - Warehouse not found: {warehouse_id}, User: {user.username}")
            return Response({
                'success': False,
                'error': "Warehouse not found"
            }, status=404)

        # Get stocks for this warehouse
        stocks = Stock.objects.filter(
            sublocation__warehouse=warehouse,
            product_id__in=product_ids if product_ids else []
        ).select_related("product", "sublocation")

        if not stocks.exists():
            logger.info(f"[WAREHOUSE_CSV] SUCCESS - No stock found, User: {user.username}")
            return Response({
                'success': True,
                'message': "No stock found for the given warehouse/products"
            }, status=200)

        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="warehouse_{warehouse.id}_stock_prediction.csv"'

        writer = csv.writer(response)
        # Header
        writer.writerow([
            "Product SKU",
            "Product Name",
            "Sublocation",
            "Current Quantity",
            "Predicted Demand (this year)"
        ])

        for stock in stocks:
            predicted_demand = demand_model.predict(warehouse.id, stock.product.id)
            writer.writerow([
                stock.product.sku,
                stock.product.name,
                stock.sublocation.code,
                stock.quantity,
                predicted_demand
            ])

        logger.info(f"[WAREHOUSE_CSV] SUCCESS - CSV generated, User: {user.username}, Records: {stocks.count()}")
        return response
