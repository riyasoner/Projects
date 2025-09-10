import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

function RefundSetting() {
    const { get, post, patch, del } = useApi();
    const [settings, setSettings] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ bank: false, wallet: false });
    const [editMode, setEditMode] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState(null);

    // fetch settings
    const fetchSettings = async () => {
        try {
            const res = await get(endpoints.getAllRefundSettings);
            if (res.status) {
                setSettings(res.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleOpen = (edit = false, setting = null) => {
        setEditMode(edit);
        if (edit && setting) {
            setSelectedSetting(setting);
            setFormData({ bank: setting.bank, wallet: setting.wallet });
        } else {
            setSelectedSetting(null);
            setFormData({ bank: false, wallet: false });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editMode && selectedSetting) {
                await patch(`${endpoints.updateRefundSetting}/${selectedSetting.id}`, {
                    // id: selectedSetting.id,
                    ...formData,
                });
                toast.success("Refund setting updated");
            } else {
                await post(endpoints.createRefundSetting, formData);
                toast.success("Refund setting created");
            }
            setOpen(false);
            fetchSettings();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        try {
            await del(`${endpoints.deleteRefundSetting}/${id}`);
            toast.success("Refund setting deleted");
            fetchSettings();
        } catch (err) {
            console.error(err);
        }
    };


     const handleDeleteClick = (id) => {
        confirmAlert({
          title: "Confirm Deletion",
          message: "Are you sure you want to delete this Refund Setting?",
          buttons: [
            {
              label: "Yes",
              onClick: () => handleDelete(id),
            },
            {
              label: "No",
            },
          ],
        });
      };

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Refund Settings</h2>
                <button
                    className="px-4 py-2 button text-white rounded-md"
                    onClick={() => handleOpen(false)}
                >
                    Create Setting
                </button>
            </div>

            {/* Table */}

            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-center font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">Bank Refund</th>
                            <th className="px-4 py-3 font-semibold">Wallet Refund</th>
                            <th className="px-4 py-3 font-semibold">Created At</th>
                            <th className="px-4 py-3 font-semibold">Updated At</th>
                            <th className="px-4 py-3 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {settings.length > 0 ? (
                            settings.map((setting, index) => (
                                <tr
                                    key={setting.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${setting.bank
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {setting.bank ? "Enabled" : "Disabled"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${setting.wallet
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {setting.wallet ? "Enabled" : "Disabled"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(setting.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(setting.updatedAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 flex justify-center gap-2">
                                        <button
                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                                            onClick={() => handleOpen(true, setting)}
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition"
                                            onClick={() => handleDeleteClick(setting.id)}
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No settings available. Please create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            {editMode ? "Edit Refund Setting" : "Create Refund Setting"}
                        </h3>

                        {/* Form */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="font-medium">Bank Refund</label>
                                <input
                                    type="checkbox"
                                    checked={formData.bank}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            bank: e.target.checked,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <label className="font-medium">Wallet Refund</label>
                                <input
                                    type="checkbox"
                                    checked={formData.wallet}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            wallet: e.target.checked,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 button text-white rounded-md"
                                onClick={handleSave}
                            >
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RefundSetting;
