from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from warehouse.models import Warehouse, SubLocation
from product.models import Product
from warehouse.models import Stock
from operations.models import Receipt, Delivery, InternalTransfer, StockAdjustment, MoveHistory
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with sample data...')

        # Create superuser if not exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Created superuser: admin/admin123')

        # Create test user
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user('testuser', 'test@example.com', 'test123')
            self.stdout.write('Created test user: testuser/test123')

        user = User.objects.get(username='testuser')

        # Create warehouses
        warehouses_data = [
            {'name': 'Main Warehouse', 'code': 'WH001', 'address': '123 Main St', 'city': 'New York', 'state': 'NY', 'country': 'USA'},
            {'name': 'West Coast Hub', 'code': 'WH002', 'address': '456 West Ave', 'city': 'Los Angeles', 'state': 'CA', 'country': 'USA'},
            {'name': 'Central Distribution', 'code': 'WH003', 'address': '789 Center Blvd', 'city': 'Chicago', 'state': 'IL', 'country': 'USA'},
        ]

        warehouses = []
        for data in warehouses_data:
            warehouse, created = Warehouse.objects.get_or_create(
                code=data['code'],
                defaults={
                    'name': data['name'],
                    'address': data['address'],
                    'city': data['city'],
                    'state': data['state'],
                    'country': data['country'],
                    'pincode': '12345',
                    'capacity_value': 10000,
                    'capacity_unit': 'sqft',
                    'is_active': True,
                }
            )
            warehouses.append(warehouse)
            if created:
                self.stdout.write(f'Created warehouse: {warehouse.name}')

        # Create sublocations
        sublocations_data = [
            {'warehouse': warehouses[0], 'aisle': 'A', 'rack': '01', 'bin': '01'},
            {'warehouse': warehouses[0], 'aisle': 'A', 'rack': '01', 'bin': '02'},
            {'warehouse': warehouses[0], 'aisle': 'A', 'rack': '02', 'bin': '01'},
            {'warehouse': warehouses[0], 'aisle': 'B', 'rack': '01', 'bin': '01'},
            {'warehouse': warehouses[1], 'aisle': 'C', 'rack': '01', 'bin': '01'},
            {'warehouse': warehouses[1], 'aisle': 'C', 'rack': '01', 'bin': '02'},
            {'warehouse': warehouses[2], 'aisle': 'D', 'rack': '01', 'bin': '01'},
        ]

        sublocations = []
        for data in sublocations_data:
            sublocation, created = SubLocation.objects.get_or_create(
                warehouse=data['warehouse'],
                aisle=data['aisle'],
                rack=data['rack'],
                bin=data['bin'],
                defaults={}
            )
            sublocations.append(sublocation)
            if created:
                self.stdout.write(f'Created sublocation: {sublocation.code}')

        # Create products
        products_data = [
            {'name': 'Laptop Computer', 'sku': 'LT001', 'category': 'FIN', 'type': 'finished', 'weight': 2.5},
            {'name': 'Wireless Mouse', 'sku': 'MS001', 'category': 'FIN', 'type': 'finished', 'weight': 0.1},
            {'name': 'USB Cable', 'sku': 'CB001', 'category': 'FIN', 'type': 'finished', 'weight': 0.05},
            {'name': 'Office Chair', 'sku': 'CH001', 'category': 'FIN', 'type': 'finished', 'weight': 15.0},
            {'name': 'Printer Paper', 'sku': 'PP001', 'category': 'RAW', 'type': 'consumable', 'weight': 5.0},
            {'name': 'Coffee Beans', 'sku': 'CF001', 'category': 'RAW', 'type': 'consumable', 'weight': 1.0},
            {'name': 'LED Light Bulb', 'sku': 'LB001', 'category': 'FIN', 'type': 'finished', 'weight': 0.2},
            {'name': 'Tool Kit', 'sku': 'TK001', 'category': 'FIN', 'type': 'finished', 'weight': 3.0},
        ]

        products = []
        for data in products_data:
            product, created = Product.objects.get_or_create(
                sku=data['sku'],
                defaults={
                    'name': data['name'],
                    'category': data['category'],
                    'type': data['type'],
                    'weight': data['weight'],
                }
            )
            products.append(product)
            if created:
                self.stdout.write(f'Created product: {product.name}')

        # Create stock
        stock_data = [
            {'product': products[0], 'sublocation': sublocations[0], 'quantity': 25},
            {'product': products[1], 'sublocation': sublocations[0], 'quantity': 45},
            {'product': products[2], 'sublocation': sublocations[1], 'quantity': 80},
            {'product': products[3], 'sublocation': sublocations[2], 'quantity': 8},
            {'product': products[4], 'sublocation': sublocations[3], 'quantity': 60},
            {'product': products[5], 'sublocation': sublocations[4], 'quantity': 12},
            {'product': products[6], 'sublocation': sublocations[5], 'quantity': 35},
            {'product': products[7], 'sublocation': sublocations[6], 'quantity': 4},  # Low stock
            {'product': products[0], 'sublocation': sublocations[4], 'quantity': 15},
            {'product': products[1], 'sublocation': sublocations[5], 'quantity': 20},
        ]

        for data in stock_data:
            stock, created = Stock.objects.get_or_create(
                product=data['product'],
                sublocation=data['sublocation'],
                defaults={'quantity': data['quantity']}
            )
            if created:
                self.stdout.write(f'Created stock: {stock.product.name} at {stock.sublocation.code} - {stock.quantity} units')

        # Create some sample receipts
        receipt_data = [
            {'warehouse': warehouses[0], 'supplier': 'TechCorp Inc.', 'date': timezone.now().date(), 'notes': 'Monthly electronics delivery'},
            {'warehouse': warehouses[1], 'supplier': 'Office Supplies Co.', 'date': timezone.now().date(), 'notes': 'Office supplies restock'},
        ]

        for i, data in enumerate(receipt_data):
            receipt = Receipt.objects.create(
                reference=f'RCP-{i+1:04d}',
                warehouse=data['warehouse'],
                supplier=data['supplier'],
                date=data['date'],
                notes=data['notes'],
                validated=True
            )
            # Add some items to receipt
            for j in range(random.randint(2, 4)):
                product = random.choice(products)
                sublocation = random.choice([sl for sl in sublocations if sl.warehouse == data['warehouse']])
                quantity = random.randint(5, 20)
                receipt.items.create(
                    product=product,
                    location=sublocation,
                    quantity=quantity,
                    unit_price=random.uniform(10, 100)
                )
            self.stdout.write(f'Created receipt: {receipt.reference}')

        # Create some sample deliveries
        delivery_data = [
            {'warehouse': warehouses[0], 'customer': 'ABC Corp', 'date': timezone.now().date(), 'notes': 'Client order fulfillment'},
            {'warehouse': warehouses[1], 'customer': 'XYZ Ltd', 'date': timezone.now().date(), 'notes': 'Bulk order delivery'},
        ]

        for i, data in enumerate(delivery_data):
            delivery = Delivery.objects.create(
                reference=f'DLV-{i+1:04d}',
                warehouse=data['warehouse'],
                customer=data['customer'],
                date=data['date'],
                notes=data['notes'],
                validated=True
            )
            # Add some items to delivery
            for j in range(random.randint(1, 3)):
                product = random.choice(products)
                sublocation = random.choice([sl for sl in sublocations if sl.warehouse == data['warehouse']])
                quantity = random.randint(2, 10)
                delivery.items.create(
                    product=product,
                    location=sublocation,
                    quantity=quantity
                )
            self.stdout.write(f'Created delivery: {delivery.reference}')

        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
        self.stdout.write('You can now login with:')
        self.stdout.write('  Admin: admin/admin123')
        self.stdout.write('  User: testuser/test123')