import React, { useEffect, useState } from "react";
import { FaPlus, FaWallet, FaCheckCircle, FaClock, FaCalendarAlt } from "react-icons/fa";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

const PayoutRequest = () => {
  const [payout, setPayout] = useState([]);
  const [amountValue, setAmountValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [walletSummary, setWalletSummary] = useState(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const { get, post, del } = useApi();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPayout(pagination.currentPage);
  }, [pagination.currentPage]);

  useEffect(() => {
    fetchWalletSummary();
  }, []);

  const fetchWalletSummary = async () => {
    try {
      const res = await get(`${endpoints.getWalletSummary}/${userId}`);
      if (res?.data) {
        setWalletSummary(res.data);
      } else {
        setWalletSummary(getDefaultWallet());
      }
    } catch (err) {
      console.error(err.message);
      setWalletSummary(getDefaultWallet());
    }
  };

  const getDefaultWallet = () => ({
    balance: "0.00",
    withdrawnAmount: "0.00",
    pendingBalance: "0.00",
    currency: "&#x20b9;",
    lastUpdated: new Date().toISOString(),
  });

  const fetchPayout = async (page) => {
    try {
      const res = await get(
        `${endpoints.getAllPayoutRequests}?sellerId=${userId}&page=${page}&limit=${pagination.limit}`
      );
      setPayout(res.data || []);
      setPagination(res?.pagination || pagination);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to fetch payout requests");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await del(`${endpoints.deletePayoutRequestById}/${id}`);
      toast.success(res.message || "Deleted successfully");
      fetchPayout(pagination.currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amountValue || !userId) {
      toast.warning("Amount and sellerId are required");
      return;
    }

    try {
      const payload = { amount: amountValue, sellerId: userId };
      const res = await post(endpoints.createPayoutRequest, payload);
      toast.success(res.message || "Payout created successfully");
      setShowModal(false);
      setAmountValue("");
      fetchPayout(pagination.currentPage);
      fetchWalletSummary();
    } catch (err) {
      toast.error(err.message || "Failed to create payout");
    }
  };

  const goToPage = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold satosi_bold">Payout Request Management</h2>
        <p className="text-sm text-gray-500">Manage your Payout Requests</p>
      </div>

      {/* ✅ Wallet Summary Cards */}
      {walletSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
            <FaWallet className="text-purple-600 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-xl ">
                &#x20b9; {walletSummary.balance}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Withdrawn</p>
              <p className="text-xl ">
                &#x20b9; {walletSummary.withdrawnAmount}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
            <FaClock className="text-orange-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl ">
                &#x20b9; {walletSummary.pendingBalance}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
            <FaCalendarAlt className="text-blue-600 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-medium">
                {new Date(walletSummary.lastUpdated).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Create Payout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 button text-white px-4 py-2 rounded-lg"
        >
          <FaPlus />
          Create Payout
        </button>
      </div>

      {/* ✅ Payout Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Amount</th>
              {/* <th className="px-4 py-3 text-left">Seller ID</th> */}
              <th className="px-4 py-3 text-left">Status</th>

              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payout.length === 0 ? (
              <tr>
                <td className="text-center py-3" colSpan={5}>
                  No Data Found
                </td>
              </tr>
            ) : (
              payout.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {(pagination.currentPage - 1) * pagination.limit + index + 1}
                  </td>
                  <td className="px-4 py-3">{item.amount || item.amountValue}</td>
                  {/* <td className="px-4 py-3">{item.sellerId}</td> */}
                  <td className="px-4 py-3">{item.status}</td>

                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className={`${item.status === "pending"
                          ? "text-red-600 hover:text-red-800"
                          : "text-gray-400 cursor-not-allowed"
                        }`}
                      disabled={item.status !== "pending"}
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => goToPage(pagination.currentPage - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={pagination.currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => goToPage(pagination.currentPage + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Payout</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setAmountValue("");
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutRequest;
