import React, { useEffect, useState } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const CustomerRating = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { get, del, patch } = useApi();

  useEffect(() => {
    fetchRatings(currentPage);
  }, [currentPage]);

  const fetchRatings = async (page) => {
    try {
      const response = await get(`${endpoints.getAllRatings}?page=${page}`);
      setRatings(response.data || []);
      setTotalPages(response?.totalPages || 1);
      setCurrentPage(response?.currentPage || 1);
    } catch (error) {
      console.log(error.message, "Error in Fetching Ratings");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteRating}/${id}`);
      toast.success(response.message || "Deleted Rating");
      fetchRatings(currentPage); // Refresh
    } catch (err) {
      toast.error(err.message || "Failed to delete Rating");
    }
  };

  const handleApprove = async (id, value) => {
    try {
      const response = await patch(`${endpoints.updateRating}/${id}`, { isApproved: value });
      toast.success("Rating status updated!");
      fetchRatings(currentPage);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Rating?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(id) },
        { label: "No" },
      ],
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Rating Management</h2>
        <p className="text-sm text-gray-500">Manage your Customer Ratings</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Customer Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Review</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{item.user?.fullName}</td>
                <td className="px-4 py-3">{item.user?.email}</td>
                <td className="px-4 py-3 font-semibold flex items-center gap-1">
                  {item.rating} <FaStar className="text-yellow-400" />
                </td>
                <td className="px-4 py-3 ">{item.review}</td>
                <td className="px-4 py-3">
                  {item.isApproved ? (
                    <span className="text-green-600 font-medium">Approved</span>
                  ) : (
                    <span className="text-orange-500 font-medium">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  {item.isApproved ? (
                    <button
                      className="text-orange-500 hover:text-orange-700"
                      onClick={() => handleApprove(item.id, false)}
                      title="Disapprove"
                    >
                      <FiXCircle size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleApprove(item.id, true)}
                      title="Approve"
                    >
                      <FiCheckCircle size={18} />
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </td>
              </tr>
            ))}
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
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-purple-700 text-white" : ""
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerRating;
