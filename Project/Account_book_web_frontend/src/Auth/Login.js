import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import endPoints from "../api/endPoints";
import useApi from "../hooks/useApi";

const Login = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_no: "",
    password: "",
    login_from: "web",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await post(endPoints.login, formData); // Assuming the endpoint for login is "login"
      if (response.status) {
        setMessage({
          type: "success",
          text: response.message || "Login successful!",
        });
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userType", response.data.user_type);
        localStorage.setItem("Token", response.data.refreshToken);

        // Store the token or any session-related information if needed
        // For example: localStorage.setItem('token', response.token);
        if (response.data) {
          setTimeout(() => {
            navigate("/bussiness"); // Redirect to the dashboard after successful login
          }, 2000);
        }
      } else {
        setMessage({
          type: "error",
          text: response.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <img
          src="/pix-account-logo/Account-book-with-name.png"
          alt="Pix Account  Logo"
          className="mx-auto d-block mb-3"
          style={{ width: "150px", height: "auto" }}
        />
        <p className="text-center text-secondary mb-4">Welcome Back!</p>

        {message.text && (
          <div
            className={`alert alert-${
              message.type === "success" ? "success" : "danger"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="phone_no" className="form-label">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              className="form-control"
              placeholder="Enter your phone number"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>{/* Add remember me functionality here if needed */}</div>
            {/* <Link to="#" className="text-decoration-none text-secondary">Forgot Password?</Link> */}
          </div>

          <div className="d-grid text-center">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        {/* <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-primary text-decoration-none">
              Sign Up
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
