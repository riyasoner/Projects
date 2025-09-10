import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import Navbar from "../../../layout/Navbar";
import Footer from "../../../layout/Footer";
import { FaArrowLeft } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";

// Badge utility
const getStatusBadge = (status) => {
    const map = {
        pending: "bg-gray-100 text-gray-600 border border-gray-300",
        packed: "bg-blue-100 text-blue-700 border border-blue-200",
        shipped: "bg-purple-100 text-purple-700 border border-purple-200",
        outfordelivery: "bg-orange-100 text-orange-700 border border-orange-200",
        delivered: "bg-green-100 text-green-700 border border-green-300",
        cancelled: "bg-red-100 text-red-700 border border-red-300",
    };
    return map[status?.toLowerCase()] || "bg-yellow-100 text-yellow-700 border border-gray-300";
};

// Tracking timeline

const OrderTracking = ({ steps, setShowModel }) => (
  <div className="mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h4 className="font-semibold text-gray-800 text-xl">Order Tracking</h4>
      <button
        className="bg-red-500 text-white px-4 py-1.5 shadow-sm hover:bg-red-600 transition duration-200 text-sm rounded-md"
        onClick={() => setShowModel(true)}
        style={{borderRadius:"5px"}}
      >
        Cancel
      </button>
    </div>

    {/* Timeline */}
    <div className="relative">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start mb-2 relative">
          {/* Circle + Line */}
          <div className="relative flex flex-col items-center">
            {/* Circle */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10
                ${
                  step.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
            >
              {step.completed ? <FaCheck size={10} /> : index + 1}
            </div>

            {/* Vertical Line (center se niklegi) */}
            {index < steps.length - 1 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0.5 h-full bg-gray-300 z-0"></div>
            )}
          </div>

          {/* Step Content */}
          <div className="ml-4">
            <p
              className={`text-sm font-semibold ${
                step.completed ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
            <p className="text-xs text-gray-400">
              {step.date
                ? new Date(step.date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Pending"}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);


const OrderDetailsPage = () => {
    const { id } = useParams();
    const { get } = useApi();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showModel, setShowModel] = useState(false)
    const [trackingSteps, setTrackingSteps] = useState([]);
    const { patch } = useApi();
    const [refund, setRefund] = useState("")

    const [cancelReason, setCancelReason] = useState("");
    const [settings, setSettings] = useState([]);



    const fetchSettings = async () => {
        try {
            const res = await get(endpoints.getAllRefundSettings);
            if (res.status) {
                setSettings(res.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };



    const handleCancelOrder = async () => {
        try {
            const response = await patch(`${endpoints.cancelOrder}/${id}`, {
                reason: cancelReason,
                refundMethod: refund
            });
            toast.success(response.message)
            console.log("Order cancelled:", response.data);
            setShowModel(false);
            fetchOrder(); // Refresh order status
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error(error.message)
        }
    };



    useEffect(() => {
        fetchOrder();
        fetchSettings();
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await get(`${endpoints.getOrderById}/${id}`);
            const data = response.data;
            setOrder(data);

            const {
                orderStatus,
                paymentStatus,
                createdAt,
                shippedAt,
                deliveredAt,
                updatedAt,
            } = data;

            // Step priority order
            const statusOrder = ["placed", "shipped", "delivered", "cancelled", "refunded"];
            const currentStatusIndex = statusOrder.indexOf(orderStatus);

            const steps = [];

            // Step 1: Placed
            steps.push({
                label: "Placed",
                date: createdAt,
                completed: currentStatusIndex >= statusOrder.indexOf("placed"),
            });

            // Step 2: Shipped
            steps.push({
                label: "Shipped",
                date: shippedAt,
                completed: currentStatusIndex >= statusOrder.indexOf("shipped"),
            });

            // Step 3: Delivered
            steps.push({
                label: "Delivered",
                date: deliveredAt,
                completed: currentStatusIndex >= statusOrder.indexOf("delivered"),
            });

            // Step 4: Cancelled
            if (orderStatus === "cancelled") {
                steps.push({
                    label: "Cancelled",
                    date: updatedAt,
                    completed: true,
                });
            }

            // Step 5: Refunded (optional)
            if (paymentStatus === "refunded") {
                steps.push({
                    label: "Refunded",
                    date: updatedAt,
                    completed: true,
                });
            }

            setTrackingSteps(steps);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) return <p className="text-center py-10">Loading Order Details...</p>;
    if (!order) return <p className="text-center py-10 text-gray-600">Order not found.</p>;

    const {
        createdAt,
        packedAt,
        shippedAt,
        outForDeliveryAt,
        deliveredAt,
        orderStatus,
        items = [],
        finalAmount,
        discount,
        shippingFee,
        paymentMethod,
        paymentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        shippingAddress,
        user,
    } = order;

    // const trackingSteps = [
    //     { label: "placed", date: createdAt, completed: false },
    //     // { label: "Packed", date: packedAt, completed: !!packedAt },
    //     { label: "Shipped", date: shippedAt, completed: true },
    //     // { label: "Out for Delivery", date: outForDeliveryAt, completed: !!outForDeliveryAt },
    //     { label: "Delivered", date: deliveredAt, completed: !!deliveredAt },
    // ];

    return (
        <>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-10">
                    {/* Back Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                            <FaArrowLeft size={14} />
                            Back
                        </button>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 uppercase">Order Details</h2>
                        <span
                            className={`mt-2 sm:mt-0 inline-block px-4 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                orderStatus
                            )}`}
                        >
                            {orderStatus}
                        </span>
                    </div>

                    {/* Grid: Address + Summary */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Shipping Address */}
                        <div className="bg-white p-5 rounded-xl border shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-3 satosi_bold">Shipping Address</h4>
                            <p className="text-sm text-gray-700 leading-6">
                                {shippingAddress?.fullName} ({shippingAddress?.phoneNumber}) <br />
                                {shippingAddress?.addressLine1} <br />
                                {shippingAddress?.city}, {shippingAddress?.state} -{" "}
                                {shippingAddress?.postalCode}
                                <br />
                                {shippingAddress?.country}
                            </p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-5 rounded-xl border shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-3 satosi_bold">Order Summary</h4>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span className="font-bold text-green-500">₹{discount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee</span>
                                    <span className="font-bold">₹{shippingFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Paid</span>
                                    <span className="font-bold">₹{finalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment</span>
                                    <span className="capitalize font-bold">
                                        {paymentMethod} ({paymentStatus})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking link */}
                    {/* <div className="flex justify-end mb-6">
      {order?.suborder?.trackingUrl ? (
        <a
          href={order.suborder.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          View Tracking Details
        </a>
      ) : (
        <p className="text-sm text-gray-400">No tracking link</p>
      )}
    </div> */}

                    {/* Items */}
                    <div className=" rounded-xl  shadow-sm  mb-8">
                        {/* <h4 className="font-semibold text-gray-800 mb-4">Items in this Order</h4> */}
                        <div className="grid gap-5">
                            {items.map((item) => {
                                const { product = {}, variant = {}, suborder = {} } = item;
                                console.log("Customisations 👉", item);
                                return (
                                    <div key={item.id} className="space-y-1">

                                        {/* Tracking Link (above the card) */}
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {/* {product?.title} ({variant?.variantName}) */}
                                            </span>
                                            {suborder?.trackingUrl ? (
                                                <a
                                                    href={suborder.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block text-xs px-4 py-2 rounded-lg bg-blue-500 text-white font-medium  no-underline shadow-sm hover:bg-blue-600 transition"
                                                >
                                                    Track Order
                                                </a>

                                            ) : (
                                                <span className="text-xs text-gray-400">No tracking link</span>
                                            )}
                                        </div>

                                        {/* Product Card */}
                                        <div className="grid sm:grid-cols-12 gap-0 items-center border rounded-lg p-4 mt-2 bg-white shadow-sm">
                                            {/* Image */}
                                            <div className="sm:col-span-[2] ">
                                                <img
                                                    src={`${variant?.variantImages?.[0]}`}
                                                    alt={product?.title}
                                                    className="w-24 h-24 object-cover rounded-lg border"
                                                />
                                            </div>

                                            {/* Details */}
                                            {/* Details */}
                                            <div className="sm:col-span-8">
                                                <p className="font-bold text-[13px] mb-0 satosi_bold">{product?.brand}</p>
                                                <p className="text-gray-700 text-[14px] font-bold  satosi_light line-clamp-1  mb-0 ">
                                                    {variant?.variantName}
                                                </p>
                                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-0">
                                                    {/* <p>
                                                        Color:{" "}
                                                        <span className="font-medium text-gray-900">{variant?.color}</span>
                                                    </p> */}
                                                    <p>
                                                        Quantity:{" "}
                                                        <span className="font-medium text-gray-900">{item.quantity}</span>
                                                    </p>
                                                    
                                                </div>
                                                 <p className="text-sm font-bold text-gray-900 mb-0">₹{item.price}</p>


                                                {/* Customisations */}

                                                {/* Customisations */}
                                                {order.customisations &&
                                                    order.customisations
                                                        .filter((c) => c.productId === item.productId)
                                                        .map((custom, idx) => (
                                                            <div
                                                                key={idx}
                                                                className=" rounded-md text-xs sm:text-sm mb-0"
                                                            >
                                                                <span className="inline-block bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full mb-0">
                                                            Customize
                                                        </span>
                                                                <div className="flex flex-wrap gap-4 mt-1">
                                                                    {Object.entries(custom.customData || {}).map(([key, value]) => (
                                                                        <span key={key} className="text-gray-700">
                                                                            {key}: <span className="font-medium">{String(value)}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}


                                            </div>


                                            {/* Price */}
                                            {/* <div className="sm:col-span-2 text-right">
                                                <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
                                            </div> */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>

                    {/* Tracking Component */}
                    <OrderTracking steps={trackingSteps} setShowModel={setShowModel} />
                </main>

                {/* Cancel Order Modal */}
                {showModel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Cancel Order
                            </h3>
                            <label className="block mb-2 text-sm text-gray-700">
                                Reason for cancellation
                            </label>
                            <textarea
                                rows={3}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Enter reason..."
                            />

                            {paymentMethod !== "cod" && (
                                <>
                                    <label className="block mb-2 text-sm text-gray-700 mt-3">
                                        Refund Method
                                    </label>
                                    {settings.length === 0 ? (
                                        <p className="text-red-700">Refund is Not Available</p>
                                    ) : (
                                        <select
                                            onChange={(e) => setRefund(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                        >
                                            <option value="">Select Method</option>
                                            {settings.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    {item.bank && <option value="account">Bank</option>}
                                                    {item.wallet && <option value="wallet">Wallet</option>}
                                                </React.Fragment>
                                            ))}
                                        </select>
                                    )}
                                </>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModel(false)}
                                    className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={!cancelReason.trim() || (!refund.trim() && paymentMethod !== "cod")}
                                    className="px-4 py-2 text-sm rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </>
    );
};

export default OrderDetailsPage;
