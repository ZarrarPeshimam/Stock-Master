from django.contrib import admin
from .models import OTP

# Register your models here.

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_code', 'is_used', 'created_at', 'expires_at')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__username', 'user__email', 'otp_code')
    readonly_fields = ('otp_code', 'created_at', 'expires_at')

    def has_add_permission(self, request):
        # Prevent manual creation of OTPs
        return False
