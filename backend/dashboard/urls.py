from django.urls import path
from .views import DashboardKPIsView, DashboardStatisticsView

urlpatterns = [
    path('kpis/', DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('statistics/', DashboardStatisticsView.as_view(), name='dashboard-statistics'),
]
