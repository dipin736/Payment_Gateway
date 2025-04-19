from django.urls import path
from .views import RegisterView, UserProfileView, KYCUploadView,InitiatePaymentView,ProcessPaymentView,TransactionListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('userprofile/', UserProfileView.as_view()),
    path('kyc/upload/', KYCUploadView.as_view()),
    path('initiate-payment/', InitiatePaymentView.as_view()),
    path('process-payment/', ProcessPaymentView.as_view()),
    path('transactions/', TransactionListView.as_view()),
    
]
