import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { BaseUrl } from "../endpoint/apiUrl";

const ProcessPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState({
    card_number: "",
    card_holder_name: "",
    expiry_date: "",
    cvv: "",
    upi_id: "",
    bank_name: "",
    reference_number: "",
  });
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const { convertedAmount } = location.state || {};
  console.log("Converted Amount:", convertedAmount);
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

  // Get the payment_id from the URL query parameters
  const paymentId = new URLSearchParams(location.search).get("payment_id");
  const methodFromQuery = new URLSearchParams(location.search).get("method");

  useEffect(() => {
    if (methodFromQuery) {
      setPaymentMethod(methodFromQuery);
    }
  }, [methodFromQuery]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BaseUrl}/process-payment/`,
        { payment_id: paymentId, ...paymentDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentStatus("Payment successful");
      navigate("/dashboard");
      Swal.fire({
        icon: "success",
        title: "Success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Payment failed");
      setPaymentStatus("Payment failed");
    }
  };

  return (
    <div className="container">
      <Sidebar userData={userData} />

      <div className="main-content">
        <div className="card">
          <p className="h8 py-3">Process Payment</p>

          <div className="mb-3">
            <label className="text mb-2">Payment Method:</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled
            >
              <option value="card">💳 Card</option>
              <option value="upi">📱 UPI</option>
              <option value="netbanking">🏦 Net Banking</option>
            </select>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className="d-flex flex-column mb-3">
                <p className="text mb-1">Card Number</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.card_number}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      card_number: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="d-flex flex-column mb-3">
                <p className="text mb-1">Card Holder Name</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Name on Card"
                  value={paymentDetails.card_holder_name}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      card_holder_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 col-12 d-flex flex-column mb-3">
                  <p className="text mb-1">Expiry</p>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="MM/YYYY"
                    value={paymentDetails.expiry_date}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        expiry_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 col-12 d-flex flex-column mb-3">
                  <p className="text mb-1">CVV/CVC</p>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="***"
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cvv: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "upi" && (
            <div className="d-flex flex-column mb-3">
              <p className="text mb-1">UPI ID</p>
              <input
                className="form-control"
                type="text"
                placeholder="yourname@upi"
                value={paymentDetails.upi_id}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    upi_id: e.target.value,
                  })
                }
                required
              />
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <>
              <div className="d-flex flex-column mb-3">
                <p className="text mb-1">Bank Name</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g. SBI, ICICI"
                  value={paymentDetails.bank_name}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      bank_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="d-flex flex-column mb-3">
                <p className="text mb-1">Reference Number</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Reference No."
                  value={paymentDetails.reference_number}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      reference_number: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </>
          )}

          <div
            className="btn btn-primary mb-3 justify-content-center"
            onClick={handlePaymentSubmit}
          >
            <span className="text-center me-2">Pay ${convertedAmount}</span>
            <span className="fas fa-arrow-right"></span>
          </div>

          {paymentStatus && <p className="text-success">{paymentStatus}</p>}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProcessPayment;
