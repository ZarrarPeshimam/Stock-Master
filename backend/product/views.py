from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Product
from .serailizer import ProductListSerializer, ProductDetailSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductDetailSerializer   # full data for creation
        return ProductListSerializer        # minimal list
    
class ProductRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
