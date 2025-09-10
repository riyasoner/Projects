import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmptyOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 px-4">
      <div className=" p-8 md:p-10 rounded-3xl  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        
        {/* Icon */}
        <div className="flex justify-center mb-6 text-6xl text-purple">
          <FaBoxOpen />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Orders Yet
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 text-sm">
          You haven’t placed any orders yet. Start shopping and your orders will appear here.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="button text-white font-semibold py-2 px-8 rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          🛍 Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default EmptyOrders;
