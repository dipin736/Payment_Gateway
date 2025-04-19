# 💳 Payment Gateway – Full Stack Application

A secure and responsive payment gateway system supporting Card, UPI, and Net Banking transactions, featuring a React.js frontend and a Django REST API backend.

---

## 🧾 Features

- **User Authentication**: Secure login and registration with JWT
- **Payment Processing**: Initiate and process payments via Card, UPI, or Net Banking
- **Multi-Currency Support**: Real-time currency conversion for international transactions
- **Transaction Management**: View transaction history with filtering options
- **Responsive Design**: Optimized for both web and mobile platforms
- **Security Compliance**: Implements data encryption and tokenization

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Bootstrap, React Router
- **Backend**: Django, Django REST Framework
- **Authentication**: JWT (`djangorestframework-simplejwt`)
- **Currency Conversion**: External API integration (e.g., ExchangeRate-API)



## 📁 Project Structure

```plaintext
Payment_Gateway/
├── PaymentBackend/    
├── PaymentFrontend/   
└── README.md  



 📦 Installation

1. Clone the Repository

git clone https://github.com/your-username/payment-gateway.git
cd Payment-Gateway

 2. Setup Backend

Run migrations and start the server:

cd PaymentBackend

python manage.py migrate

python manage.py runserver

The backend API will be available at http://localhost:8000/api/

 3. Setup Frontend

cd PaymentFrontend

npm install

npm run dev

The frontend app will run at http://localhost:5173

📬 API Endpoints

POST /api/initiate-payment/ – Initiate a new payment

POST /api/process-payment/ – Process an existing payment

GET /api/transactions/ – Retrieve transaction history



