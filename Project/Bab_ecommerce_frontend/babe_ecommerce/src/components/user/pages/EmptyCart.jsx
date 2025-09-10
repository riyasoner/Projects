import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-center ">
      <div className="p-10 rounded-3xl  text-center max-w-md w-100 ">
        <div className="flex justify-center mb-6 text-6xl  text-purple">
          <FaShoppingCart />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Oops! Empty Cart</h2>
        <p className="text-gray-600 mb-6 text-sm">
          You haven’t added anything to your cart yet. Start shopping now!
        </p>
        <button
          onClick={() => navigate("/")}
          className="  button text-white font-semibold py-2 px-8 rounded-full  transition duration-300"
        >
           Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
