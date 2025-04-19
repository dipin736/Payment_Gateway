import requests
from .models import Currency

def update_exchange_rates():
    url = "https://api.exchangerate-api.com/v4/latest/INR"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        for code, rate in data["rates"].items():
            Currency.objects.update_or_create(code=code, defaults={
                "exchange_rate_to_inr": 1 / rate if rate != 0 else 0
            })
