import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { BaseUrl } from "../endpoint/apiUrl";
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const isAuthenticated = !!localStorage.getItem("access_token");


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
       `${BaseUrl}/login/`,
        formData
      );
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting to your dashboard...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false, 
      }).then(() => {
// Inside your login form submit handler
navigate("/dashboard", { replace: true });

      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "An error occurred during login.";
  

      Swal.fire({
        title: "Login Failed!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="container-sm py-5">
  <form
    className="mx-auto shadow p-5 rounded bg-white"
    style={{ maxWidth: "500px" }}
    onSubmit={handleSubmit}
    encType="multipart/form-data"
  >
    <h2 className="text-center mb-4">Login</h2>

    <div className="mb-4">
      <label htmlFor="name" className="form-label">
        Username:
      </label>
      <input
        type="text"
        name="username"
        id="name"
        className="form-control form-control-lg"
        placeholder="Enter username"
        value={formData.username}
        onChange={handleChange}
        required
      />
    </div>

    <div className="mb-4 position-relative">
      <label htmlFor="password" className="form-label">
        Password:
      </label>
      <input
        type={passwordVisible ? "text" : "password"}
        name="password"
        id="password"
        className="form-control form-control-lg pe-5"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 mt-3 border-0"
        style={{ background: "transparent" }}
      >
        {passwordVisible ? (
          <FaEyeSlash style={{ fontSize: "20px", color: "#000" }} />
        ) : (
          <FaEye style={{ fontSize: "20px", color: "#000" }} />
        )}
      </button>
    </div>

    <button
      type="submit"
      className="btn btn-dark btn-lg w-100 mt-4"
    >
      Log in
    </button>

    <div className="text-center mt-4">
      <p className="mb-1">Don't have an account?</p>
      <a
        className="btn btn-link"
        href="/"
      >
        Sign up here
      </a>
    </div>
  </form>
</div>

  );
};

export default Login;
