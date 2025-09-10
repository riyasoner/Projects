import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";

const ForgotPassword = () => {
  const {post}=useApi()
  const [email,setEmail]=useState("")
  const navigate = useNavigate();

  

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await post(endpoints.forgetPassword,{email:email});
    toast.success(response.message || " Password reset Link sent to email ")
  
    setTimeout(()=>{
        navigate("/");
    },1500)
  } catch (error) {
    toast.error(error.message || "server Error");
  }
};



  return (
    
    <>
   
   <div 
  className="flex min-h-screen items-center justify-center bg-cover bg-center"
  // style={{
  //   backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30')"
  // }}
>
  {/* Form Card */}
  <div className="w-full max-w-md px-8 py-6 bg-white shadow-2xl rounded-2xl">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
      Forgot Password
    </h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="you@example.com"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full button py-2 rounded-lg hover:bg-gray-900 transition"
      >
        Forgot Password
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

  
    </>
   
  );
};

export default ForgotPassword;
