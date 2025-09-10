import React from "react";
import { FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmptyReview = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-center">
      <div className=" p-10 rounded-3xl  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6 text-yellow-500 text-6xl animate-bounce">
          <FaCommentDots />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          No Reviews Yet
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          It looks like this product hasn't received any reviews yet. Be the first to share your experience!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition duration-300"
        >
          Explore Products
        </button>
      </div>
    </div>
  );
};

export default EmptyReview;
