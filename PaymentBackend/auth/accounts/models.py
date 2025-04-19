
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    is_kyc_verified = models.BooleanField(default=False)
    kyc_document = models.FileField(upload_to='kyc_docs/', null=True, blank=True)
    terms_accepted = models.BooleanField(default=False)
    details_confirmed = models.BooleanField(default=False)

class Currency(models.Model):
    code = models.CharField(max_length=10, unique=True)
    exchange_rate_to_inr = models.FloatField()  # INR as base

    def __str__(self):
        return self.code

class PaymentRequest(models.Model):
    PAYMENT_METHODS = (
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('netbanking', 'Net Banking'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.FloatField()
    currency = models.CharField(max_length=5, default='INR')
    converted_amount_in_inr = models.FloatField(null=True)
    method = models.CharField(choices=PAYMENT_METHODS, max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    transaction_id = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"