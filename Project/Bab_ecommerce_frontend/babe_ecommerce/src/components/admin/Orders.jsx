// Orders.jsx
import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaEdit,
  FaTrashAlt,
  FaEye,
} from "react-icons/fa";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Orders = () => {
  const { get, patch, del } = useApi();
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchSummary();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await get(`${endpoints.getOrders}?page=${currentPage}`);
      setOrders(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.log("Error for Fetching Orders", error);
    }
  };

  const exportOrdersToExcel = () => {
    const formattedOrders = orders.map((order) => ({
      OrderID: order.id,
      Customer: order.user?.fullName,
      Email: order.user?.email,
      PaymentStatus: order.paymentStatus,
      OrderStatus: order.orderStatus,
      CreatedAt: new Date(order.createdAt).toLocaleString(),
      FinalAmount: order.finalAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(fileData, "orders.xlsx");
  };

  const fetchSummary = async () => {
    try {
      const response = await get(endpoints.getOrderSummary);
      setSummary(response || {});
    } catch (error) {
      console.log("Error for Fetching Summary", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this order?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await del(`${endpoints.deleteOrder}/${id}`);
              if (response.status) {
                toast.success("Order deleted successfully");
                fetchOrders();
              } else {
                toast.error("Failed to delete order");
              }
            } catch (err) {
              toast.error("Error deleting order");
            }
          },
        },
        {
          label: "No",
        },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  const handleEdit = (order) => {
    setEditOrderId(order.id);
    setEditStatus(order.orderStatus);
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await patch(`${endpoints.updateOrderStatus}/${editOrderId}`, {
        orderStatus: editStatus,
      });
      if (response.status) {
        toast.success("Order status updated");
        setEditOrderId(null);
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      toast.error("Error updating order status");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold satosi_bold">Orders Management</h2>
          <p className="text-gray-500 satosi_light">
            View and manage all customer orders in one place.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={exportOrdersToExcel} style={{borderRadius:"30px"}}
        >
          <FaDownload /> Export Orders
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 satosi_regular">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <FaShoppingCart /> <span>Total Orders</span>
          </div>
          <h3 className="text-2xl mt-2 satosi_bold">{summary?.totalOrders || 0}</h3>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-600 font-bold">
            <FaClock /> <span>Pending Orders</span>
          </div>
          <h3 className="text-2xl mt-2 satosi_bold">{summary?.statusCounts?.pending || 0}</h3>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <FaCheckCircle /> <span>Completed Orders</span>
          </div>
          <h3 className="text-2xl mt-2 satosi_bold">
            {(summary?.statusCounts?.placed || 0) +
              (summary?.statusCounts?.shipped || 0) +
              (summary?.statusCounts?.delivered || 0)}
          </h3>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <FaTimesCircle /> <span>Cancelled Orders</span>
          </div>
          <h3 className="text-2xl mt-2 satosi_bold">{summary?.statusCounts?.cancelled || 0}</h3>
        </div>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm satosi_regular">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-purple-700 font-medium">{order.id}</td>
                <td className="p-4">
                  <p className="font-semibold">{order.user?.fullName}</p>
                  <p className="text-sm text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                    }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-semibold">₹{order.finalAmount}</td>
                <td className="p-4">{order.orderStatus}</td>
                <td className="p-4 flex gap-3">
                  <button className="text-purple"
                    onClick={() => {
                      navigate("/admin/view_order", { state: { id: order.id } })
                    }}>
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(order)} className="text-blue-600">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(order.id)} className="text-red-600">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-1 border rounded-md hover:bg-gray-100"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="px-4 py-1 border rounded-md hover:bg-gray-100"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="placed">Placed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditOrderId(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleStatusUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;