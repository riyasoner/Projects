import React, { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { FaFileCsv, FaPlus, FaSitemap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit, FiCopy } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const PlateformCharges = () => {
    const navigate = useNavigate();
    const [plateform, setPlateform] = useState([])
    const { get, patch, del } = useApi()

    useEffect(() => {
        fetchPlateform()
    }, [])


    const fetchPlateform = async () => {
        try {
            const response = await get(endpoints.getAllAdminFeeConfigs)
            setPlateform(response.data || [])

        } catch (error) {
            console.log(error.message, "Error in Fetching Plateform fee")

        }
    }

    const handleDelete = async (id) => {

        try {
            const response = await del(`${endpoints.deleteAdminFeeConfig}/${id}`);
            toast.success(response.message || "Plateform Fee deleted");
            fetchPlateform(); // Refresh list
        } catch (err) {
            toast.error(err.message || "Failed to delete plateform fee");

        }

    };
    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this Category?",
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
        <div className="p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 satosi_bold">Plateform Fee Management</h2>
                <p className="text-sm text-gray-500 satosi_regular">Manage your Plateform Fee</p>
            </div>


            <div className="flex justify-end gap-3 mb-5 satosi_regular" >


                <button
                    onClick={() => {
                        navigate("/admin/add_platform_fee")

                    }}
                    className="flex items-center gap-2 bg-purple-800 text-white text-sm px-4 py-2 rounded-[10px] hover:bg-purple-700 transition" style={{ borderRadius: "10px", backgroundColor: "var(--purple)" }}
                >
                    <FaPlus style={{ borderRadius: "50%", border: "1px solid white", padding: "2px" }} />
                    Add Plateform Fee
                </button>


            </div>



            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Fee Type</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Amount Type</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Amount Value</th>
                            {/* <th className="px-4 py-3 text-left font-medium text-gray-600">Admin ID</th> */}
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Created At</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plateform.length===0?(<tr ><td className="px-4 py-3 text-center" colSpan={"7"}>Not Found</td></tr>):plateform.map((item, index) => (
                            <tr
                                key={item.id}
                                className="border-t hover:bg-gray-50 transition duration-200"
                            >
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3 capitalize">{item.feeType.replace("_", " ")}</td>
                                <td className="px-4 py-3 capitalize">{item.amountType}</td>
                                <td className="px-4 py-3">{item.amountValue}</td>
                                {/* <td className="px-4 py-3">{item.adminId}</td> */}
                                <td className="px-4 py-3">
                                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3 flex gap-2 items-center">
                                    {/* Edit (Optional: Create edit route later) */}
                                    <button
                                        className="text-yellow-600 hover:text-yellow-800"
                                        onClick={() => navigate(`/admin/edit_platform_fee`,{state:{id:item.id}})}
                                    >
                                        <FiEdit size={18} />
                                    </button>

                                    {/* Delete */}
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
        </div>
    );
};

export default PlateformCharges;
