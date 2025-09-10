import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";

const PayoutRequestAdmin = () => {
    const [payout, setPayout] = useState([]);
    const [pagination, setPagination] = useState({
        totalRecords: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
    });

    const { get, del, patch } = useApi();

    useEffect(() => {
        fetchPayout(pagination.currentPage);
    }, [pagination.currentPage]);

    const fetchPayout = async (page) => {
        try {
            const res = await get(`${endpoints.getAllPayoutRequests}?page=${page}&limit=${pagination.limit}`);
            setPayout(res.data || []);
            setPagination(res?.pagination || pagination);
        } catch (err) {
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

    const handleApprove = async (id) => {
        try {
            const res = await patch(`${endpoints.approvePayoutRequest}/${id}`, {});
            toast.success(res.message || "Request Approved");
            
            fetchPayout(pagination.currentPage);
        } catch (err) {
            toast.error(err.message || "Approval failed");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await patch(`${endpoints.rejectPayoutRequest}/${id}`, {});
            toast.success(res.message || "Request Rejected");
            fetchPayout(pagination.currentPage);
        } catch (err) {
            toast.error(err.message || "Rejection failed");
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
                <h2 className="text-2xl font-bold">Payout Requests</h2>
                <p className="text-sm text-gray-500">Approve or Reject payout requests</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            {/* <th className="px-4 py-3 text-left">Seller ID</th> */}
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Requested At</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                            <th className=""> Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payout.length === 0 ? (
                            <tr>
                                <td className="text-center py-3" colSpan={6}>
                                    No Data Found
                                </td>
                            </tr>
                        ) : (
                            payout.map((item, index) => (
                                <tr key={item.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {(pagination.currentPage - 1) * pagination.limit + index + 1}
                                    </td>
                                    <td className="px-4 py-3">{item.amount}</td>
                                    {/* <td className="px-4 py-3">{item.sellerId}</td> */}
                                    <td className="px-4 py-3 capitalize">{item.status}</td>
                                    <td className="px-4 py-3">
                                        {new Date(item.requested_at).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => handleApprove(item.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                            disabled={item.status !== "pending"}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => handleReject(item.id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                            disabled={item.status !== "pending"}
                                        >
                                            Reject
                                        </button>


                                        {/* <button
                                            onClick={() => handleDeleteClick(item.id)}
                                            className="text-red-600 text-xl"
                                        >
                                            <MdDeleteOutline />
                                        </button> */}
                                    </td>
                                    <td className=""><button
                                        onClick={() => handleDeleteClick(item.id)}
                                        className="text-red-600 text-xl"
                                    >
                                        <MdDeleteOutline size={20} />
                                    </button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
        </div>
    );
};

export default PayoutRequestAdmin;
