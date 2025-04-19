from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PaymentRequest
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_kyc_verified', 'kyc_document','terms_accepted','details_confirmed')



class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRequest
        fields = ['id', 'amount', 'currency', 'status', 'method', 'created_at']