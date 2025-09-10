import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OrderCustomisation() {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate=useNavigate()

  useEffect(() => {
    fetchCustomisationOrderBySellerId();
  }, []);

  const fetchCustomisationOrderBySellerId = async () => {
    try {
      const response = await get(
        `${endpoints.getCustomisationsOrderbySellerId}/${userId}`
      );
      setOrders(response.data || []);
    } catch (error) {
      console.log("Error For Fetching Customisation Orders", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 satosi_bold">
         Customisation Orders
      </h2>
      

      <div className="bg-white shadow-md rounded-xl overflow-hidden border mt-4 border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Customisations
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Order Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Payment Method
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition duration-200 border-t"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.product.images?.[0]}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {item.product.sku}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {Object.entries(item.customData).map(([key, value]) => (
                      <p key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ₹{item.product.price}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.order.orderStatus === "placed"
                          ? "bg-blue-100 text-blue-700"
                          : item.order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-700">
                    {item.order.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-700">

                    <button className="to-blue-700" onClick={()=>{
                      navigate("/seller/view-customize-order",{state:{orders:item}})
                    }}>
                      <FaEye/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                  colSpan="7"
                >
                  No Customisation Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderCustomisation;
