import React from "react";
import { useLocation } from "react-router-dom";

function ViewCustomizeOrder() {
  const { state } = useLocation();
  const order = state?.orders;

  if (!order) {
    return <div className="p-6 text-center">No Order Found</div>;
  }

  const product = order?.product;
  const customData = order?.customData || {};

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800 pb-2">
        Order Details
      </h2>

      {/* Order Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Order Information
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
            <p><span className="font-medium">Status:</span> {order.order?.orderStatus}</p>
            <p><span className="font-medium">Payment:</span> {order.order?.paymentMethod} ({order.order?.paymentStatus})</p>
            <p><span className="font-medium">Final Amount:</span> ₹{order.order?.finalAmount}</p>
            <p><span className="font-medium">Discount:</span> ₹{order.order?.discount}</p>
            <p><span className="font-medium">Shipping Fee:</span> ₹{order.order?.shippingFee}</p>
            <p><span className="font-medium">Created At:</span> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Product Information
          </h3>
          <div className="flex items-start gap-4">
            <img
              src={product?.images?.[0]}
              alt={product?.title}
              className="w-24 h-24 rounded-lg object-cover border"
            />
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">{product?.title}</p>
              <p><span className="font-medium">Brand:</span> {product?.brand}</p>
              <p><span className="font-medium">Price:</span> ₹{product?.price}</p>
              <p><span className="font-medium">Category:</span> {product?.categoryId}</p>
              <p><span className="font-medium">Stock:</span> {product?.stock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Data */}
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Customization Details
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(customData).map(([key, value]) => (
            <div
              key={key}
              className="p-3 border rounded-lg bg-gray-50 text-sm text-gray-700"
            >
              <span className="font-medium capitalize">{key}:</span> {value}
            </div>
          ))}
        </div>
      </div>

      {/* Product Features */}
      {product?.features?.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Product Features
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ViewCustomizeOrder;
