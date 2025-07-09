from django.core.management.base import BaseCommand
from pos.models import Product
from decimal import Decimal

class Command(BaseCommand):
    help = 'Load sample data for testing'

    def handle(self, *args, **options):
        sample_products = [
            {
                'name': 'Coca Cola 500ml',
                'description': 'Refreshing cola drink',
                'price': Decimal('40.00'),
                'stock_quantity': 50,
                'barcode': '1234567890123',
                'category': 'Beverages'
            },
            {
                'name': 'Lay\'s Chips Classic',
                'description': 'Crispy potato chips',
                'price': Decimal('20.00'),
                'stock_quantity': 30,
                'barcode': '1234567890124',
                'category': 'Snacks'
            },
            {
                'name': 'Amul Milk 1L',
                'description': 'Fresh whole milk',
                'price': Decimal('60.00'),
                'stock_quantity': 25,
                'barcode': '1234567890125',
                'category': 'Dairy'
            },
            {
                'name': 'Parle-G Biscuits',
                'description': 'Glucose biscuits',
                'price': Decimal('15.00'),
                'stock_quantity': 100,
                'barcode': '1234567890126',
                'category': 'Snacks'
            },
            {
                'name': 'Maggi Noodles',
                'description': '2-minute instant noodles',
                'price': Decimal('12.00'),
                'stock_quantity': 75,
                'barcode': '1234567890127',
                'category': 'Instant Food'
            },
            {
                'name': 'Colgate Toothpaste',
                'description': 'Dental care toothpaste',
                'price': Decimal('85.00'),
                'stock_quantity': 8,
                'barcode': '1234567890128',
                'category': 'Personal Care'
            },
            {
                'name': 'Dove Soap',
                'description': 'Moisturizing soap bar',
                'price': Decimal('45.00'),
                'stock_quantity': 0,
                'barcode': '1234567890129',
                'category': 'Personal Care'
            },
            {
                'name': 'Britannia Bread',
                'description': 'Fresh white bread',
                'price': Decimal('25.00'),
                'stock_quantity': 20,
                'barcode': '1234567890130',
                'category': 'Bakery'
            },
            {
                'name': 'Tata Tea Premium',
                'description': 'Premium tea leaves',
                'price': Decimal('120.00'),
                'stock_quantity': 15,
                'barcode': '1234567890131',
                'category': 'Beverages'
            },
            {
                'name': 'Sunfeast Biscuits',
                'description': 'Cream biscuits',
                'price': Decimal('30.00'),
                'stock_quantity': 5,
                'barcode': '1234567890132',
                'category': 'Snacks'
            }
        ]
        
        # Clear existing products
        Product.objects.all().delete()
        self.stdout.write("Cleared existing products")
        
        # Create new products
        for product_data in sample_products:
            product = Product.objects.create(**product_data)
            self.stdout.write(f"Created: {product.name} - ₹{product.price}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {len(sample_products)} sample products!'
            )
        )