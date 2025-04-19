from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import RegisterSerializer, TransactionSerializer, UserSerializer
import uuid, json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import PaymentRequest, Currency, CustomUser
# Create your views here.


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class KYCUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        doc = request.FILES.get('kyc_document')

        terms_accepted = str(request.data.get('terms_accepted', '')).lower() == 'true'
        details_confirmed = str(request.data.get('details_confirmed', '')).lower() == 'true'

        if not terms_accepted:
            return Response({"status": "You must accept the terms and conditions."}, status=400)

        if not details_confirmed:
            return Response({"status": "Please confirm your details before uploading."}, status=400)

        if doc:
            user.kyc_document = doc
            user.terms_accepted = terms_accepted
            user.details_confirmed = details_confirmed
            user.is_kyc_verified = True
            user.save()
            return Response({"status": "KYC document uploaded and verified successfully."})
        else:
            return Response({"status": "No document provided."}, status=400)




class InitiatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        amount = float(data.get("amount", 0))
        currency = data.get("currency", "INR")
        method = data.get("method", "card")

        try:
            exchange_rate = Currency.objects.get(code=currency).exchange_rate_to_inr
        except Currency.DoesNotExist:
            return Response({"error": "Invalid currency"}, status=400)

        converted = amount * exchange_rate

        # Create a new payment request
        payment = PaymentRequest.objects.create(
            user=user,
            amount=amount,
            currency=currency,
            method=method,
            converted_amount_in_inr=converted,
            transaction_id=str(uuid.uuid4())
        )

        return Response({"payment_id": payment.id, "converted_amount": converted}, status=201)

class ProcessPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        payment_id = data.get("payment_id")

        try:
            payment = PaymentRequest.objects.get(id=payment_id)
        except PaymentRequest.DoesNotExist:
            return Response({"error": "Invalid Payment ID"}, status=404)

        if payment.method == "card":
            card_number = data.get("card_number", "")
            card_holder_name = data.get("card_holder_name", "")
            expiry_date = data.get("expiry_date", "") 
            cvv = data.get("cvv", "")

            # Check for card number validity
            if len(card_number) < 12 or not card_number.isdigit():
                return Response({"success": False, "message": "Invalid card number,"
                "Card Number must be atleast 12"}, status=400)

            if not card_holder_name or not expiry_date or not cvv:
                return Response({"success": False, "message": "Incomplete card details"}, status=400)

            # Store masked card details (last 4 digits only for security)
            payment.card_holder_name = card_holder_name
            payment.card_last_four = card_number[-4:]
            payment.card_expiry = expiry_date

        elif payment.method == "upi":
            upi_id = data.get("upi_id", "")
            if "@upi" not in upi_id:
                return Response({"success": False, "message": "Invalid UPI ID use : @upi"}, status=400)

            payment.upi_id = upi_id 

        elif payment.method == "netbanking":
            bank_name = data.get("bank_name", "")
            reference_number = data.get("reference_number", "")

            if not bank_name or not reference_number:
                return Response({"success": False, "message": "Bank name and reference number are required for net banking"}, status=400)

            payment.bank_name = bank_name
            payment.reference_number = reference_number

        if not payment.transaction_id:
            payment.transaction_id = f"TXN{payment.id:06d}"

        payment.status = "success"
        payment.save()

        return Response({
            "success": True,
            "transaction_id": payment.transaction_id
        })

class TransactionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = PaymentRequest.objects.filter(user=user).order_by('-created_at')  
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    

