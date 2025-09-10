import React from "react";
import { FaHeartBroken } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmptyWishlist = () => {
  const navigate = useNavigate();

  // Check login status using localStorage
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className=" p-10 rounded-3xl  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6 text-purple text-6xl animate-pulse">
          <FaHeartBroken />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Your Wishlist is Empty</h2>

        {isLoggedIn ? (
          <>
            <p className="text-gray-600 mb-6 text-sm">
              Looks like you haven’t added any favorites yet. Browse products and add some love!
            </p>
            <button
              onClick={() => navigate("/")}
              className="button text-white font-semibold py-2 px-8 rounded-full shadow-lg transition duration-300"
            >
              Go For Add to Wishlist
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-sm">
              Please login to see items in your wishlist.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="button text-white font-semibold py-2 px-8 rounded-full shadow-lg transition duration-300 hover:bg-gray-800"
            >
              LOGIN
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyWishlist;
