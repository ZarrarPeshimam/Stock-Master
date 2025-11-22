from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from warehouse.models import Stock
from product.models import Product
from django.db.models import Sum
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Check for low stock items and send alerts'

    def add_arguments(self, parser):
        parser.add_argument(
            '--threshold',
            type=int,
            default=10,
            help='Stock threshold for low stock alerts',
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Email address to send alerts to',
        )
        parser.add_argument(
            '--send-email',
            action='store_true',
            help='Send email alerts',
        )

    def handle(self, *args, **options):
        threshold = options['threshold']
        email = options['email']
        send_email = options['send_email']

        self.stdout.write(f'Checking for products with stock below {threshold}...')

        # Get low stock products
        low_stock_products = (
            Stock.objects.values('product')
            .annotate(total_qty=Sum('quantity'))
            .filter(total_qty__lte=threshold)
            .select_related('product')
        )

        low_stock_items = []
        for item in low_stock_products:
            product = Product.objects.get(id=item['product'])
            total_qty = item['total_qty']
            low_stock_items.append({
                'product': product,
                'quantity': total_qty,
                'threshold': threshold
            })

        if low_stock_items:
            self.stdout.write(f'Found {len(low_stock_items)} products with low stock:')

            alert_message = f"Low Stock Alert - {len(low_stock_items)} items below threshold ({threshold})\n\n"
            for item in low_stock_items:
                product_name = item['product'].name
                quantity = item['quantity']
                self.stdout.write(f'  - {product_name}: {quantity} units')
                alert_message += f"- {product_name}: {quantity} units\n"

            # Send email if requested
            if send_email and email:
                try:
                    send_mail(
                        subject='Low Stock Alert',
                        message=alert_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False,
                    )
                    self.stdout.write(self.style.SUCCESS(f'Alert email sent to {email}'))
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f'Failed to send email: {e}'))
            elif send_email and not email:
                self.stderr.write(self.style.ERROR('--email is required when using --send-email'))
        else:
            self.stdout.write('No products with low stock found.')

        self.stdout.write(self.style.SUCCESS('Low stock check completed.'))