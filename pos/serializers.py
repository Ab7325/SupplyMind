from rest_framework import serializers
from .models import Product, Sale, SaleItem
from decimal import Decimal

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'total_price']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Sale
        fields = ['id', 'total_amount', 'payment_method', 'created_at', 'receipt_number', 'items']
        read_only_fields = ['receipt_number']

class CreateSaleSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    payment_method = serializers.ChoiceField(choices=Sale.PAYMENT_METHODS)
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total
        total = Decimal('0')
        sale_items = []
        
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            quantity = int(item_data['quantity'])
            unit_price = product.price
            total_price = quantity * unit_price
            total += total_price
            
            sale_items.append({
                'product': product,
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price
            })
        
        # Create sale
        import uuid
        receipt_number = f"RCP{uuid.uuid4().hex[:8].upper()}"
        
        sale = Sale.objects.create(
            total_amount=total,
            payment_method=validated_data['payment_method'],
            receipt_number=receipt_number
        )
        
        # Create sale items and update stock
        for item_data in sale_items:
            SaleItem.objects.create(
                sale=sale,
                **item_data
            )
            # Update stock
            product = item_data['product']
            product.stock_quantity -= item_data['quantity']
            product.save()
        
        return sale