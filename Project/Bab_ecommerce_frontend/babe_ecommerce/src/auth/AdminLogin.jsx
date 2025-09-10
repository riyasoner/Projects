import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";
import { initMessaging } from "../firebase/firebase"; // import isSupported too

const AdminLogin = () => {
  const { post } = useApi();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await post(endpoints.login, {
      email: form.email,
      password: form.password,
    });

    const { access_token, refresh_token, userType, userId, message } = response;

    // ✅ only allow login if userType === "user"
    if (userType === "admin") {
      // Store tokens and user info
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);

      toast.success(message || "Login Successfully");

      // Register FCM Token
      try {
        const token = await initMessaging();
        if (token) {
          await post(endpoints.fcmRegistration, { token, userId, userType });
        }
      } catch (err) {
        console.log("Error initializing messaging:", err);
      }

      // Navigate to home page after success
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } else {
      
      toast.error("These credentials are not valid for Admin login");
    }

  } catch (error) {
    toast.error("Invalid Credentials. Please Try Again");
  }
};


  return (
    <>
     <div
  className="flex min-h-screen items-center justify-center bg-cover bg-center"
  // style={{
  //   backgroundImage:
  //     'url("https://img.freepik.com/premium-vector/online-shopping-digital-technology-with-icon-blue-background-ecommerce-online-store-marketing_252172-219.jpg")',
  // }}
>
  <div className="w-full max-w-md px-8 py-6 bg-white bg-opacity-95 shadow-2xl rounded-2xl">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
      Admin Login
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="you@example.com"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="••••••••"
          required
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full button text-white py-2 rounded-lg hover:bg-gray-900 transition"
      >
        Login
      </button>
    </form>

    {/* Forgot Password */}
    <p className="text-center text-sm text-gray-600 mt-4">
      <Link
        to="/forgot_password"
        className="text-black font-medium hover:underline"
        style={{ textDecoration: "none" }}
      >
        Forgot Password?
      </Link>
    </p>
  </div>
</div>

    </>
  );
};

export default AdminLogin;
