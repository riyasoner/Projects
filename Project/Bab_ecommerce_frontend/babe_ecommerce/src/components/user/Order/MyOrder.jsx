import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Add this
import Navbar from "../../../layout/Navbar";
import Footer from "../../../layout/Footer";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import EmptyOrders from "../pages/EmptyOrder";

const MyOrder = () => {
  const navigate = useNavigate(); // <-- Hook
  const userId = localStorage.getItem("userId");
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdersByUserId();
  }, []);

  const fetchOrdersByUserId = async () => {
    try {
      const response = await get(`${endpoints.getOrders}?userId=${userId}`);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const renderOrders = () => {
    if (loading) {
      return <p className="text-center text-gray-500 py-10">Loading your orders...</p>;
    }

    if (!orders.length) {
      return (
        <div className="text-center text-gray-600 text-lg py-20">
          <EmptyOrders/>
        </div>
      );
    }

    return orders.map((order) => {

      console.log("order",order)
  const {
    id,
    createdAt,
    items = [],
    orderStatus: status,
    totalAmount,

  } = order;


  console.log("order",order)

  const firstItem = items[0] || {};
  const { product = {}, variant = {} } = firstItem;
  const image = variant?.variantImages?.[0] || "https://via.placeholder.com/80";
  const otherItemsCount = items.length - 1;

  return (
    <div
      key={id}
      className="bg-white rounded-xl border mt-4 border-gray-200 mb-6 p-4 sm:p-6 relative shadow-sm hover:shadow-md transition"
    >
      {/* Top section: status + date */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            status === "delivered"
              ? "bg-green-100 text-green-700"
              : status === "cancelled"
              ? "bg-red-100 text-red-700"
              :status==="processing"
              ?"bg-orange-100 text-orange-900"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status || "Processing"}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Main content row */}
      <div className="flex items-start gap-4">
        {/* Image */}
        <img
          src={image}
          alt={product.title}
          className="w-20 h-20 rounded-lg border object-cover"
        />

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 mb-0">
            Order ID: <span className="text-red-600">{id}</span>
          </p>
            <p className="font-bold text-[13px] mb-0 satosi_bold">{product?.brand}</p>
          <p className="text-gray-700 text-[14px] font-bold  satosi_light line-clamp-1  mb-0 ">
            {variant?.variantName || "Product Name"}{" "}
            {otherItemsCount > 0 && (
              <span className="text-blue-600 font-medium">
                & {otherItemsCount} more item{otherItemsCount > 1 ? "s" : ""}
              </span>
            )}
          </p>
        
          {/* <p className="text-sm text-gray-600 ">{product?.title}</p> */}
           
          <p className="text-base text-black font-semibold mt-2">₹ {totalAmount || "0"}</p>
        </div>

        {/* Right arrow (view details) */}
        <button
          onClick={() => navigate(`/order-details/${id}`)}
          className="text-gray-400 hover:text-black transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
});

  };

  return (
    <>
   {/* <Navbar /> */}
    <div className="min-h-screen  bg-gray-50 flex flex-col">
      
      <main className="flex-grow max-w-5xl  mx-auto w-full px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-left sm:text-left uppercase">
          My Orders
        </h2>
        {renderOrders()}
      </main>
      
    </div>
    {/* <Footer/> */}
     </>
  );
};

export default MyOrder;
