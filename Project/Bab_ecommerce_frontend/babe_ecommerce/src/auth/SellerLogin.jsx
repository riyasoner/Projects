import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";
import { initMessaging } from "../firebase/firebase"; // import isSupported too

const SellerLogin = () => {
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

    const { access_token, refresh_token, userType, userId, message, status } =
      response;

    if (status) {
        console.log(status)
      // ✅ only allow login if userType === "seller"
      if (userType === "seller") {
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
          navigate("/seller/dashboard");
        }, 1500);
      } else {
        // ❌ block other roles
        toast.error("These credentials are not valid for User login");
      }
    } else {
        console.log(status)
      // ❌ API ne status false bheja
      toast.error(message || "Login failed, please try again.");
    }
  } catch (error) {
    // ✅ Proper error handling from backend
    toast.error(error.message ||
        "Invalid Credentials. Please Try Again"
    );
  }
};



    return (
        <>
            <div
                className="flex min-h-screen items-center justify-center bg-cover bg-center"
                // style={{
                //     backgroundImage:
                //         'url("https://w0.peakpx.com/wallpaper/239/942/HD-wallpaper-neon-lines-background-dark-abstract-abstraction-lines-light-background-neon-lines.jpg")',
                // }}
            >
                <div className="w-full max-w-md px-8 p-6 bg-white bg-opacity-90 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
                        Seller Login
                    </h2>
                    <p className="text-center text-sm text-gray-600 mb-6">
                        Log in to sell your best products!
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
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

                        <button
                            type="submit"
                            className="w-full  button text-white py-2 rounded-lg  transition"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/seller-signup")}
                            className="text-black font-medium hover:underline cursor-pointer"
                        >
                            Sign up
                        </span>
                    </p>

                    <p className="text-center font-medium hover:underline cursor-pointer mt-3">
                        <Link
                            to="/forgot_password"
                            className="text-gray"
                            style={{ textDecoration: "none" }}
                        >
                            Forgot Password
                        </Link>
                    </p>

                    <p className="text-center mt-3">
                        Login as a User?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-black  font-medium hover:underline cursor-pointer"
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>

        </>
    );
};

export default SellerLogin;
