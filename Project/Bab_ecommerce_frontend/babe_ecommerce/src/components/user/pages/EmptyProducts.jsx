import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmptyProducts = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-center bg-gray-50">
      <div className=" p-10 rounded-3xl  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6 text-6xl text-gray-400">
          <FaBoxOpen />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Products Found
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          It seems there are no products available at the moment.
        </p>
        <button
          onClick={() => navigate("/")}
          className="button text-white font-semibold py-2 px-8 rounded-full shadow-lg transition duration-300"
        >
          🛍 Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default EmptyProducts;
