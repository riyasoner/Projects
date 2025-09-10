import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Faq = () => {
    const navigate = useNavigate();
    const [faqList, setFaqList] = useState([]);
    const { get, del } = useApi();

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await get(endpoints.getFAQs);
            setFaqList(response.data || []);
        } catch (error) {
            toast.error("Failed to fetch FAQs");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await del(`${endpoints.deleteFAQ}/${id}`);
            toast.success(response.message || "FAQ deleted");
            fetchFaqs();
        } catch (err) {
            toast.error(err.message || "Failed to delete FAQ");
        }
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this FAQ?",
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
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">FAQ Management</h2>
                <p className="text-sm text-gray-500">Manage your Frequently Asked Questions</p>
            </div>

            {/* Add FAQ Button */}
            <div className="flex justify-end mb-5">
                <button
                    onClick={() => navigate("/admin/add_faq")}
                    className="flex items-center gap-2 button text-white text-sm px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                    <FaPlus />
                    Add FAQ
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Question</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Answer</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Product ID</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Created At</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqList.length === 0 ? (
                            <tr>
                                <td className="px-4 py-3 text-center" colSpan={7}>No FAQs Found</td>
                            </tr>
                        ) : (
                            faqList.map((faq, index) => (
                                <tr key={faq.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{faq.question}</td>
                                    <td className="px-4 py-3">{faq.answer}</td>
                                    <td className="px-4 py-3">{faq.productId || "N/A"}</td>
                                    <td className="px-4 py-3">
                                        {faq.isActive ? (
                                            <span className="text-green-600 font-medium">Active</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(faq.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2 items-center">
                                        <button
                                            className="text-yellow-600 hover:text-yellow-800"
                                            onClick={() =>
                                                navigate("/admin/edit_faq", { state: { id: faq.id } })
                                            }
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDeleteClick(faq.id)}
                                        >
                                            <MdDeleteOutline size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Faq;
