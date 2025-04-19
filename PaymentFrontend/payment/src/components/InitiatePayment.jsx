import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../endpoint/apiUrl";

const InitiatePayment = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [method, setMethod] = useState("card");
  const [paymentId, setPaymentId] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const userRes = await axios.get(`${BaseUrl}/userprofile/`, config);
      console.log(userRes);
      setUserData(userRes.data);
    };

    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }
    if (!currency) {
      setErrorMessage("Please select a currency.");
      return;
    }
    if (!method) {
      setErrorMessage("Please select a payment method.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/initiate-payment/",
        { amount, currency, method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentId(response.data.payment_id);
      navigate(
        `/processpayment?payment_id=${response.data.payment_id}&method=${method}`,
        {
          state: {
            convertedAmount: response.data.converted_amount,
            userData,
          },
        }
      );
      setConvertedAmount(response.data.converted_amount);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <Sidebar userData={userData} />
      <div className="main-content">
        <div className="card">
          <p className="h8 py-3">Initiate Payment</p>

          {/* Amount Section */}
          <div className="amount-section mb-3">
            <label className="text mb-2">Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              placeholder="Enter amount"
            />
          </div>

          {/* Currency Section */}
          <div className="currency-section mb-3">
            <label className="text mb-2">Currency:</label>
            <select
              className="form-control"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Payment Method Section */}
          <div className="payment-method mb-3">
            <label className="text mb-2">Payment Method:</label>
            <select
              className="form-control"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
            >
              <option value="card">💳 Card</option>
              <option value="upi">📱 UPI</option>
              <option value="netbanking">🏦 Net Banking</option>
            </select>
          </div>

          <div
            className="btn btn-primary mb-3 justify-content-center"
            onClick={handleSubmit}
          >
            <span className="text-center me-2">Initiate Payment</span>
            <span className="fas fa-arrow-right"></span>
          </div>


          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default InitiatePayment;
