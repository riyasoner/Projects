import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { FaPhone } from "react-icons/fa";

const Contact = () => {
  const [contact, setContact] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const { get } = useApi();

  useEffect(() => {
    fetchContacts(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchContacts = async (page) => {
    try {
      const res = await get(
        `${endpoints.getAllContacts}?page=${page}&limit=${pagination.limit}`
      );

      setContact(res.data || []);
      setPagination(res.pagination || pagination);
    } catch (err) {
      toast.error("Failed to fetch contact requests");
    }
  };

  const goToPage = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800"> Contact Requests</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all incoming contact queries
          </p>
        </div>
        <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">
          Total: {contact.length}
        </span>
      </div>

      {/* Card Grid */}
      {contact.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border">
          No Data Found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contact.map((item, index) => (
            <div
              key={item.id}
              className="group border rounded-xl p-5 shadow-sm bg-gradient-to-b from-white to-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  {(pagination.currentPage - 1) * pagination.limit + index + 1}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                  New
                </span>
              </div>

              <h5 className="text-lg font-semibold text-gray-800 mt-3 group-hover:text-indigo-600 transition">
                {item.email || "N/A"}
              </h5>
              <p className="text-sm text-gray-500 mt-1">
                {item.message || "No message provided."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => goToPage(pagination.currentPage - 1)}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 transition disabled:opacity-50"
          disabled={pagination.currentPage === 1}
        >
          Prev
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => goToPage(pagination.currentPage + 1)}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 transition disabled:opacity-50"
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Contact;
