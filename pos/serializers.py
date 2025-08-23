from rest_framework import serializers
from .models import Product, Sale, SaleItem
from decimal import Decimal
from django.db import transaction

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

        read_only_fields = ['id', 'owner', 'created_at', 'updated_at', 'is_in_stock', 'barcode']

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

class WriteSaleItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CreateSaleSerializer(serializers.Serializer):
    items = WriteSaleItemSerializer(many=True) 
    payment_method = serializers.ChoiceField(choices=Sale.PAYMENT_METHODS)
    
    def create(self, validated_data):
        # We will get the owner from the view via serializer.save(owner=...)
        owner = validated_data.pop('owner')
        items_data = validated_data.pop('items')
        
        # Use a transaction to ensure all database operations succeed or fail together
        with transaction.atomic():
            # --- Efficiently fetch all products at once ---
            product_ids = [item['product_id'] for item in items_data]
            products = Product.objects.filter(id__in=product_ids, owner=owner)

            # Check if all requested products were found and belong to the user
            if len(products) != len(product_ids):
                raise serializers.ValidationError("One or more products not found or do not belong to you.")
            
            product_map = {product.id: product for product in products}
            total_amount = Decimal('0')
            sale_items_to_create = []

            for item_data in items_data:
                product = product_map[item_data['product_id']]
                quantity = item_data['quantity']

                if product.stock_quantity < quantity:
                    raise serializers.ValidationError(f"Not enough stock for {product.name}.")

                total_amount += product.price * quantity
                
                sale_items_to_create.append(
                    SaleItem(
                        product=product,
                        quantity=quantity,
                        unit_price=product.price,
                        total_price=product.price * quantity
                    )
                )
                # Prepare stock update
                product.stock_quantity -= quantity

            import uuid

            receipt_number = f"RCP{uuid.uuid4().hex[:8].upper()}"
            sale = Sale.objects.create(
                owner=owner,
                total_amount=total_amount,
                payment_method=validated_data['payment_method'],
                receipt_number=receipt_number
            )

            # --- Link SaleItems to the new Sale and create them in bulk ---
            for item in sale_items_to_create:
                item.sale = sale
            SaleItem.objects.bulk_create(sale_items_to_create)

            # --- Update product stock in bulk ---
            Product.objects.bulk_update([p for p in product_map.values()], ['stock_quantity'])
            
            return sale