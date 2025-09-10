import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const CoinRule = () => {
    const navigate = useNavigate();
    const [coinRules, setCoinRules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { get, del, patch } = useApi();

    useEffect(() => {
        fetchCashbackRules(currentPage);
    }, [currentPage]);

    const fetchCashbackRules = async (page) => {
        try {
            const response = await get(`${endpoints.getAllCoinRules}?page=${page}`);
            setCoinRules(response.data || []);
            setTotalPages(response.totalPages || 1);
            setCurrentPage(response.page || 1);
        } catch (error) {
            console.log(error.message, "Error in Fetching Cashback Rules");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await del(`${endpoints.deleteCoinRule}/${id}`);
            toast.success(response.message || "Deleted Coin Rule");
            fetchCashbackRules(currentPage);
        } catch (err) {
            toast.error(err.message || "Failed to delete Cashback Rule");
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
        <div className="p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Coin Rules</h2>
                    <p className="text-sm text-gray-500">Manage your Coin Rules</p>
                </div>
                <button
                    className="button text-white px-4 py-2 rounded-lg shadow"
                    onClick={() => navigate("/seller/add-coin-rules")}
                >
                    Add Coin Rule
                </button>
            </div>

            {/* Table */}
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Action Type</th>
                            <th className="px-4 py-3 text-left">Coins Per Action</th>
                            <th className="px-4 py-3 text-left">Per Amount</th>
                            {/* <th className="px-4 py-3 text-left">Created By</th> */}
                            <th className="px-4 py-3 text-left">Created At</th>
                            <th className="px-4 py-3 text-left">Updated At</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coinRules.length > 0 ? (
                            coinRules.map((item) => (
                                <tr key={item.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{item.id}</td>
                                    <td className="px-4 py-3 capitalize">{item.actionType}</td>
                                    <td className="px-4 py-3">{item.coinsPerAction}</td>
                                    <td className="px-4 py-3">{item.perAmount}</td>
                                    {/* <td className="px-4 py-3">{item.createdBy}</td> */}
                                    <td className="px-4 py-3">
                                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(item.updatedAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.isActive ? (
                                            <span className="text-green-600 font-medium">Active</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {/* Edit */}
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                                                onClick={() =>
                                                    navigate("/seller/edit-coin-rules", { state: { id: item.id } })
                                                }
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            {/* Delete */}
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
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
                                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                                    No Coin Rules Found
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

export default CoinRule;
