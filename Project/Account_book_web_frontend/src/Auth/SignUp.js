import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import endPoints from "../api/endPoints";
import useApi from "../hooks/useApi";

const Signup = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    password: "",
    phone_no: "",
    user_type: "admin",
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
      const response = await post(endPoints.registration, formData);
      if (response.status) {
        setMessage({
          type: "success",
          text: response.message || "Signup successful! Redirecting...",
        });
        setFormData({
          name: "",
          email_id: "",
          password: "",
          phone_no: "",
          user_type: "user",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Signup failed. Please try again.",
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
        <p className="text-center text-secondary mb-4">Create an Account</p>

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
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_id" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email_id"
              name="email_id"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email_id}
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

          <div className="mb-3">
            <label htmlFor="phone_no" className="form-label">
              Phone Number
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

          {/* User Type Dropdown */}
          <div className="mb-3">
            <label htmlFor="user_type" className="form-label">
              User Type
            </label>
            <select
              id="user_type"
              name="user_type"
              className="form-select"
              value={formData.user_type}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-primary text-decoration-none">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
