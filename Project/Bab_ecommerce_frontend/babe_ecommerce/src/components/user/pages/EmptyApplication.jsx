import React from "react";
import { MdStorefront } from "react-icons/md"; 
import { useNavigate } from "react-router-dom";

const EmptyApplication = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 rounded-3xl text-center max-w-md w-full  shadow-lg ">
        <div className="flex justify-center mb-6 text-6xl animate-bounce text-purple">
          <MdStorefront />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          No Applications Yet
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          You haven’t applied as a seller yet. Start your journey with us!
        </p>
        <button
          onClick={() => navigate("/become_seller", { state: { userId } })}
          className="button hover:bg-purple-700 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition duration-300"
        >
          Become a Seller
        </button>
      </div>
    </div>
  );
};

export default EmptyApplication;
