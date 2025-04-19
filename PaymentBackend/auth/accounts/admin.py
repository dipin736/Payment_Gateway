from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Currency, CustomUser, PaymentRequest

# Custom User Admin to display KYC fields
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_kyc_verified', 'kyc_document', 'is_staff', 'is_active']
    list_filter = ['is_kyc_verified', 'is_staff', 'is_active']
    search_fields = ['username', 'email']
    ordering = ['username']
    
    
admin.site.register(CustomUser, CustomUserAdmin)

class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['code', 'exchange_rate_to_inr']
    search_fields = ['code']
    ordering = ['code']

admin.site.register(Currency, CurrencyAdmin)

class PaymentRequestAdmin(admin.ModelAdmin):
    list_display = ['id','user', 'amount', 'currency', 'converted_amount_in_inr', 'method', 'status', 'created_at', 'transaction_id']
    list_filter = ['status', 'method', 'currency']
    search_fields = ['user__username', 'transaction_id']
    ordering = ['-created_at']

admin.site.register(PaymentRequest, PaymentRequestAdmin)