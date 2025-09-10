import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import { FaUser, FaLock, FaSignOutAlt } from "react-icons/fa"

const SellerNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-white px-4 py-4 flex items-center justify-between shadow-sm z-50">
      {/* Left: Announcement */}
      <div className="text-sm font-semibold text-gray-700">
        {/* 📢 Big Sale is Live! Check out the new orders now. */}
      </div>

      {/* Right: Icons */}
      <div className="relative flex items-center gap-6 text-lg">
        <div className="relative" ref={dropdownRef}>
          <FaUserCircle
            size={20}
            className="cursor-pointer hover:text-black text-purple"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {/* Change Password */}
              <Link
                to="/seller/change-password"
                className="flex items-center gap-3 px-4 py-2.5 text-sm !text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                style={{ textDecoration: "none" }}
              >
                <FaLock className="text-gray-500" />
                <span className="font-medium">Change Password</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200 my-1"></div>

              {/* Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("userType");
                  localStorage.removeItem("userId");

                  toast.success("Logged out successfully!");
                  setDropdownOpen(false);

                  setTimeout(() => {
                    navigate("/");
                  }, 1000);
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <FaSignOutAlt className="text-red-500" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerNavbar;
