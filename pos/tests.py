from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Product, Sale, SaleItem

# Get the User model
User = get_user_model()

class ProductViewSetTests(APITestCase):
    def setUp(self):
        """
        Set up the test environment.
        This method is run before each test.
        """
        # Create two users to test multi-tenancy
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')

        # Create some products for each user
        self.product1_user1 = Product.objects.create(owner=self.user1, name='Laptop', price=1200.00, stock_quantity=50)
        self.product2_user1 = Product.objects.create(owner=self.user1, name='Mouse', price=25.00, stock_quantity=5) # Low stock
        self.product3_user2 = Product.objects.create(owner=self.user2, name='Keyboard', price=75.00, stock_quantity=100)

        # Authenticate the client as user1
        self.client.force_authenticate(user=self.user1)

    def test_create_product_success(self):
        """
        Ensure we can create a new product (POST works).
        """
        url = '/api/products/'
        data = {'name': 'New Monitor', 'price': '300.50', 'stock_quantity': 20}
        response = self.client.post(url, data, format='json')
        
        print("Validation Error:", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 4)
        new_product = Product.objects.get(id=response.data['id'])
        self.assertEqual(new_product.owner, self.user1)

    def test_list_products_shows_only_owned(self):
        """
        Ensure listing products only returns items owned by the authenticated user.
        """
        self.client.force_authenticate(user=self.user1)
        url = '/api/products/'
        response = self.client.get(url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # user1 has 2 products, so the list should only contain 2 items
        self.assertEqual(len(response.data['results']), 2)
        # Verify the product from user2 is not in the response
        product_names = [p['name'] for p in response.data['results']]
        self.assertNotIn('Keyboard', product_names)

    def test_unauthenticated_user_cannot_access(self):
        """
        Ensure unauthenticated users are denied access.
        """
        self.client.logout() # Log out the client
        url = '/api/products/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_low_stock_action(self):
        """
        Test the custom 'low_stock' action.
        """
        url = '/api/products/low_stock/'
        response = self.client.get(url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return the one low-stock product for user1
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Mouse')

    def test_search_action(self):
        """
        Test the custom 'search' action.
        """
        url = '/api/products/search/?q=Lap' # Search query for 'Laptop'
        response = self.client.get(url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Laptop')


class SaleViewSetTests(APITestCase):
    def setUp(self):
        """
        Set up the test environment for sales.
        """
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')

        # user1 will be selling their products
        self.product1 = Product.objects.create(owner=self.user1, name='Test Product 1', price=10.00, stock_quantity=100)
        self.product2 = Product.objects.create(owner=self.user1, name='Test Product 2', price=20.00, stock_quantity=50)

        # user2 also has a product, to ensure we don't accidentally sell it
        self.product3_user2 = Product.objects.create(owner=self.user2, name='User 2 Product', price=5.00, stock_quantity=200)

        # Authenticate as user1
        self.client.force_authenticate(user=self.user1)
    
    def test_create_sale_success(self):
        """
        Ensure we can create a new sale (POST works) and stock is updated.
        """
        url = '/api/sales/'
        initial_stock = self.product1.stock_quantity
        sale_quantity = 5

        data = {
            "payment_method": "cash",
            "items": [
                {"product_id": self.product1.id, "quantity": sale_quantity}
            ]
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check that a Sale object was created for user1
        self.assertEqual(Sale.objects.count(), 1)
        new_sale = Sale.objects.first()
        self.assertEqual(new_sale.owner, self.user1)
        
        # Check that a SaleItem was created
        self.assertEqual(SaleItem.objects.count(), 1)
        sale_item = SaleItem.objects.first()
        self.assertEqual(sale_item.product, self.product1)
        self.assertEqual(sale_item.quantity, sale_quantity)
        
        # Check that the product's stock was reduced
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.stock_quantity, initial_stock - sale_quantity)

    def test_cannot_sell_another_user_product(self):
        """
        Ensure a user cannot sell a product they do not own.
        """
        url = '/api/sales/'
        data = {
            "payment_method": "cash",
            "items": [
                {"product_id": self.product3_user2.id, "quantity": 1} # Trying to sell user2's product
            ]
        }
        response = self.client.post(url, data, format='json')

        # The serializer should raise a validation error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dashboard_stats_action(self):
        """
        Test the custom 'dashboard_stats' action.
        """
        # Create a sale for the stats to calculate
        Sale.objects.create(owner=self.user1, total_amount=100.00, payment_method='card', receipt_number='RCP1')
        
        url = '/api/sales/dashboard_stats/'
        response = self.client.get(url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check some of the stats based on our setUp data
        self.assertEqual(response.data['total_products'], 2) # user1 has 2 products
        self.assertEqual(response.data['today_sales'], 1)
        self.assertEqual(float(response.data['today_revenue']), 100.00)