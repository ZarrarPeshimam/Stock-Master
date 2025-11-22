from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random
import string

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def generate_otp(self):
        """Generate a 6-digit OTP"""
        self.otp_code = ''.join(random.choices(string.digits, k=6))
        self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        self.save()
        return self.otp_code

    def is_valid(self):
        """Check if OTP is still valid"""
        return not self.is_used and timezone.now() < self.expires_at

    class Meta:
        verbose_name = "OTP"
        verbose_name_plural = "OTPs"
