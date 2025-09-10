import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaTruck } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const LIMIT = 10;

function Shipping() {
  const { get, del } = useApi();
  const navigate = useNavigate();

  const [rules, setRules] = useState([]);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: LIMIT,
  });

  const fetchShipping = async ({ page = 1, searchText = "" } = {}) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("perPage", LIMIT);
      if (searchText) params.append("search", searchText.trim());

      const res = await get(`${endpoints.getAllShippingFees}?${params.toString()}`);

      setRules(res.data || []);
      const pg = res.pagination || {
        totalRecords: 0,
        currentPage: 1,
        totalPages: 1,
        perPage: LIMIT,
      };
      setPagination({
        total: pg.totalRecords,
        currentPage: pg.currentPage,
        totalPages: pg.totalPages,
        limit: pg.perPage,
      });
    } catch (err) {
      console.error("Error fetching shipping rules ➜", err);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => fetchShipping({ page: 1, searchText: search }), 300);
    return () => clearTimeout(id);
  }, [search]);

  const goToPage = (p) => {
    if (p > 0 && p <= pagination.totalPages && p !== pagination.currentPage) {
      fetchShipping({ page: p, searchText: search });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteShippingFee}/${id}`);
      toast.success(response.data);
      fetchShipping();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this shipping rule?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTruck className="text-purple" />
            Shipping Rules
          </h2>
          <p className="text-sm text-gray-500">
            Manage all shipping rules ({pagination.total})
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/create_shipping")}
          className="button text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <FiPlus size={18} />
          Add Shipping Fee
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute top-3.5 left-3 text-gray-400" />
          {/* <input
            type="text"
            placeholder="Search by type or city"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Flat Rate (₹)</th>
              <th className="px-4 py-3">Free Above (₹)</th>
              <th className="px-4 py-3">Weight Rate (₹/kg)</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Location Fee (₹)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {rules.map((r, i) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(pagination.currentPage - 1) * pagination.limit + i + 1}
                </td>
                <td className="px-4 py-3 capitalize">{r.shippingType.replace("_", " ")}</td>
                <td className="px-4 py-3">{r.flatRate ?? "-"}</td>
                <td className="px-4 py-3">{r.freeAboveAmount ?? "-"}</td>
                <td className="px-4 py-3">{r.weightRatePerKg ?? "-"}</td>
                <td className="px-4 py-3">{r.city ?? "-"}</td>
                <td className="px-4 py-3">{r.locationFee ?? "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => navigate("/admin/edit_shipping", { state: { id: r.id } })}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(r.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {rules.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="9">
                  No shipping rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-2 mt-6 text-sm">
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
            disabled={pagination.currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: pagination.totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-1 border rounded-md ${
                pagination.currentPage === idx + 1 ? "bg-purple-600 text-white" : ""
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Shipping;
