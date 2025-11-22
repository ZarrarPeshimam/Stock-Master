from django.db import models

# Create your models here.
class Product(models.Model):

    CATEGORY_CHOICES = [
        ('RAW', 'Raw Material'),
        ('FIN', 'Finished Goods'),
        ('PART', 'Part / Component'),
    ]

    sku = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=100)
    weight = models.FloatField()

    # NEW IMAGE FIELD
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"