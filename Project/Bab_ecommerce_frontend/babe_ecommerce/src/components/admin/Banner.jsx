import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Banner = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const { get, del } = useApi();
    const [status, setStatus] = useState("")

    useEffect(() => {
        fetchBanners();
    }, [status]);

    const fetchBanners = async () => {
        try {
            if(status){
                 const response = await get(`${endpoints.getAllBanners}?status=${status}`);
            setBanners(response.banners || []);

            }else{
                    const response = await get(`${endpoints.getAllBanners}`);
            setBanners(response.banners || []);
            }
           
        } catch (error) {
            console.log("Failed to fetch banners");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await del(`${endpoints.deleteBanner}/${id}`);
            toast.success(response.message || "Banner deleted");
            fetchBanners();
        } catch (err) {
            toast.error(err.message || "Failed to delete banner");
        }
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this banner?",
            buttons: [
                { label: "Yes", onClick: () => handleDelete(id) },
                { label: "No" },
            ],
        });
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Banner</h2>
                <p className="text-sm text-gray-500">Manage your Banners</p>
            </div>
            <div>
                <select
                    className="w-40 p-2 rounded border outline-none border-gray-300"
                    value={status === "" ? "" : status.toString()}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "true") setStatus(true);
                        else if (value === "false") setStatus(false);
                        else setStatus("");
                    }}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            {/* Add Banner Button */}
            <div className="flex justify-end mb-5">
                <button
                    onClick={() => navigate("/admin/add_banner")}
                    className="flex items-center gap-2 button text-white text-sm px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                    <FaPlus />
                    Add Banner
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Title</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Image</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Link</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Created At</th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.length === 0 ? (
                            <tr>
                                <td className="px-4 py-3 text-center" colSpan={7}>
                                    No Banners Found
                                </td>
                            </tr>
                        ) : (
                            banners.map((banner, index) => (
                                <tr key={banner.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{banner.title}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={banner.bannerImage}
                                            alt="banner"
                                            className="h-12 w-28 object-cover rounded-md border"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{banner.link || "N/A"}</td>
                                    <td className="px-4 py-3">
                                        {banner.status ? (
                                            <span className="text-green-600 font-medium">Active</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(banner.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2 items-center">
                                        <button
                                            className="text-yellow-600 hover:text-yellow-800"
                                            onClick={() =>
                                                navigate("/admin/edit_banner", { state: { banner: banner } })
                                            }
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDeleteClick(banner.id)}
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

export default Banner;
