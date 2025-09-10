import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit, FaEye } from "react-icons/fa";

const CashbackRules = () => {
  const navigate = useNavigate();
  const [cashbackRules, setCashbackRules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { get, del, patch } = useApi();

  useEffect(() => {
    fetchCashbackRules(currentPage);
  }, [currentPage]);

  const fetchCashbackRules = async (page) => {
    try {
      const response = await get(`${endpoints.getCashbackRules}?page=${page}`);
      setCashbackRules(response.cashbackRules || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.page || 1);
    } catch (error) {
      console.log(error.message, "Error in Fetching Cashback Rules");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteCashbackRule}/${id}`);
      toast.success(response.message || "Deleted Cashback Rule");
      fetchCashbackRules(currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to delete Cashback Rule");
    }
  };

  const handleStatusChange = async (id, value) => {
    try {
      const response = await patch(`${endpoints.updateCashbackRule}/${id}`, {
        isActive: value,
      });
      toast.success(response.message || "Status Updated");
      fetchCashbackRules(currentPage);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Cashback Rule?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cashback Rules</h2>
          <p className="text-sm text-gray-500">Manage your Cashback Rules</p>
        </div>
        <button
          className="button text-white px-4 py-2 rounded-lg shadow"
          onClick={() => navigate("/admin/add-cashback-rules")}
        >
          Add Cashback Rule
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Min Purchase</th>

              <th className="px-4 py-3 text-left">Payment Methods</th>
              <th className="px-4 py-3 text-left">Expiry Days</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashbackRules.length > 0 ? (
              cashbackRules.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    {item.description?.length > 50
                      ? item.description.substring(0, 20) + "..."
                      : item.description}
                  </td>
                  <td className="px-4 py-3 capitalize">{item.cashbackType}</td>
                  <td className="px-4 py-3">{item.cashbackValue}</td>
                  <td className="px-4 py-3">{item.minPurchaseAmount}</td>
                  <td className="px-4 py-3">
                    {item.paymentMethods?.join(", ")}
                  </td>
                  <td className="px-4 py-3">{item?.expiryDays}</td>
                  <td className="px-4 py-3">
                    {new Date(item.startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(item.endDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {item.isActive ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Edit Button */}

                      <button
                        className="flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-200"
                        onClick={() =>
                          navigate("/admin/view_cashbackRule", { state: { id: item.id } })
                        }
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        className="flex items-center justify-center  rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-200"
                        onClick={() =>
                          navigate("/admin/edit-cashback-rule", { state: { id: item.id } })
                        }
                      >
                        <FaEdit size={16} />
                      </button>


                      {/* Delete Button */}
                      <button
                        className="flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <MdDeleteOutline size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No Cashback Rules Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1
              ? "bg-purple-700 text-white"
              : ""
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CashbackRules;
