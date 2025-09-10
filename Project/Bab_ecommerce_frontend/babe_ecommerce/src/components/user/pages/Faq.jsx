import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Faq = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-center bg-gray-50 px-4">
      <div className=" p-10 rounded-3xl  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6 text-blue-600 text-6xl animate-bounce">
          <FaQuestionCircle />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No FAQs Found</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Currently, there are no frequently asked questions for this product.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Faq;
