import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import "./App.css";
import AdminDashboard from "./components/admin/AdminDashboard";
import SellerDashboard from "./components/seller/SellerDashboard";
import UserDashboard from "./components/user/UserDashboard";
import Profile from "./layout/Profile";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import BecomerSeller from "./layout/BecomerSeller";
import ShareLink from "./layout/ShareLink";
import ScrollToTop from "./layout/ScrollToTop";
import ProtectedRoute from "./layout/ProtectedRoute";
import { initMessaging, onForegroundMessage } from "../src/firebase/firebase";
import AdminLogin from "./auth/AdminLogin";
import SellerLogin from "./auth/SellerLogin";
import SellerRegistrarion from "./auth/SellerRegistrarion";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Dismiss all toasts when route changes
    setTimeout(() => {
      toast.dismiss();
    }, 1000);
  }, [location]);

  useEffect(() => {
    const subscribeForeground = async () => {
      await onForegroundMessage((payload) => {
        const title = payload?.notification?.title || "New notification";
        const body = payload?.notification?.body || "";
        toast.info(`${title} - ${body}`);
      });
    };
    subscribeForeground();
  }, []);
  return (
    <div className="App">
      <div className="app-container">
        <div className="main-content">
          <ScrollToTop />
          <ToastContainer
            position="top-center" // or "bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <Routes>
            <Route path="/login" element={<Login />} />
               <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/seller-login" element={<SellerLogin />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
            <Route path="/seller-signup" element={<SellerRegistrarion />} />
             <Route path="/seller-signup/become_seller" element={<BecomerSeller />} />


            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/become_seller" element={<BecomerSeller />} />
            <Route path="/ecommerce/product/:slug" element={<ShareLink />} />
            {/* Admin seller Dashboard */}

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedTypes={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/*"
              element={
                <ProtectedRoute allowedTypes={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<UserDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
