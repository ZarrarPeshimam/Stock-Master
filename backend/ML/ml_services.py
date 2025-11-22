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