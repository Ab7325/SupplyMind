from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Product, Sale, SaleItem
from .serializers import ProductSerializer, SaleSerializer, CreateSaleSerializer
from django.db import models

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock (less than 10)"""
        low_stock_products = Product.objects.filter(stock_quantity__lt=10)
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products by name or barcode"""
        query = request.query_params.get('q', '')
        if query:
            products = Product.objects.filter(
                models.Q(name__icontains=query) | 
                models.Q(barcode__icontains=query)
            )
        else:
            products = Product.objects.all()
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateSaleSerializer
        return SaleSerializer
    
    @action(detail=False, methods=['get'])
    def today_sales(self, request):
        """Get today's sales summary"""
        today = timezone.now().date()
        today_sales = Sale.objects.filter(created_at__date=today)
        
        summary = {
            'total_sales': today_sales.count(),
            'total_revenue': today_sales.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'sales': SaleSerializer(today_sales, many=True).data
        }
        return Response(summary)
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics"""
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        stats = {
            'today_sales': Sale.objects.filter(created_at__date=today).count(),
            'today_revenue': Sale.objects.filter(created_at__date=today).aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'week_sales': Sale.objects.filter(created_at__date__gte=week_ago).count(),
            'week_revenue': Sale.objects.filter(created_at__date__gte=week_ago).aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'total_products': Product.objects.count(),
            'low_stock_products': Product.objects.filter(stock_quantity__lt=10).count(),
        }
        return Response(stats)