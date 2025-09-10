import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";

const ResetPassword = () => {
  const { post } = useApi()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Password does not match")
    }
    try {
      const response = await post(`${endpoints.resetPassword}?token=${token}`, { newPassword: password });
      toast.success(response.message || " Password reset Link sent to email ")

      setTimeout(() => {
        navigate("/");
      }, 1500)
    } catch (error) {
      toast.error(error.message || "server Error");
    }
  };



  return (

    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
     
    >
      {/* Form Card */}
      <div className="w-full max-w-md px-8 py-6 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-800 transition"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-black font-medium hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>


  );
};

export default ResetPassword;
