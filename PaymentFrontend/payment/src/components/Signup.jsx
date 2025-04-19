import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { BaseUrl } from "../endpoint/apiUrl";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/register/`, formData);
      Swal.fire({
        title: "Registration Successful!",
        text: "Redirecting to your Login...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false, 
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {

      const errors = error.response?.data;
      let errorMessages = "";
  
      if (errors) {
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessages += `${errors[key].join(" ")}\n`;
          }
        }
      } else {
        errorMessages = "An unknown error occurred. Please try again.";
      }

      Swal.fire({
        title: "Registration Failed!",
        text: errorMessages,
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
      className="mx-auto shadow p-5 bg-white rounded"
      style={{ maxWidth: "500px" }}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-center mb-4">Sign Up</h2>
  
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
  
      <div className="mb-4">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="form-control form-control-lg"
          placeholder="Enter email"
          value={formData.email}
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
  
        {/* Eye icon button */}
        <button
          type="button"
          className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 mt-3 border-0"
          onClick={togglePasswordVisibility}
          style={{ background: "transparent" }}
        >
          {passwordVisible ? (
            <FaEyeSlash style={{ fontSize: "22px", color: "#000" }} />
          ) : (
            <FaEye style={{ fontSize: "22px", color: "#000" }} />
          )}
        </button>
      </div>
  
      <button
        type="submit"
        className="btn btn-dark btn-lg w-100 mt-4"
      >
        Sign up
      </button>
  
      <div className="text-center mt-4">
        <p className="mb-1">Already have an account?</p>
        <a
          className="btn btn-link"
          href="/login"
        >
          Login here
        </a>
      </div>
    </form>
  </div>
  
  );
};

export default Signup;
