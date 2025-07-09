from django.contrib import admin
from .models import Product, Sale, SaleItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock_quantity', 'category', 'is_in_stock']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'barcode']
    list_editable = ['price', 'stock_quantity']

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    readonly_fields = ['total_price']

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'total_amount', 'payment_method', 'created_at']
    list_filter = ['payment_method', 'created_at']
    search_fields = ['receipt_number']
    readonly_fields = ['receipt_number']
    inlines = [SaleItemInline]