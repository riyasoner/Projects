import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Announcement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const { get, del } = useApi();
  const [status, setStatus] = useState(""); // "" means no filter

  useEffect(() => {
    fetchAnnouncements();
  }, [status]);

  const fetchAnnouncements = async () => {
    try {
        if(status){
              const response = await get(`${endpoints.getAllAnnouncements}?status=${status}`);
          setAnnouncements(response.announcements || []);
        }else{
             const response = await get(`${endpoints.getAllAnnouncements}`);
             setAnnouncements(response.announcements || []);

        }
      
    } catch (error) {
      console.log("Failed to fetch announcements");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteAnnouncement}/${id}`);
      toast.success(response.message || "Announcement deleted");
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || "Failed to delete announcement");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this announcement?",
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
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <p className="text-sm text-gray-500">Manage your announcements</p>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
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

      {/* Add Announcement Button */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => navigate("/admin/add_announcement")}
          className="flex items-center gap-2 button text-white text-sm px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          <FaPlus />
          Add Announcement
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Message</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Link</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Created At</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td className="px-4 py-3 text-center" colSpan={6}>
                  No Announcements Found
                </td>
              </tr>
            ) : (
              announcements.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.message}</td>
                  <td className="px-4 py-3">{item.link || "N/A"}</td>
                  <td className="px-4 py-3">
                    {item.status ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
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
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() =>
                        navigate("/admin/edit_announcement", { state: { announcement: item } })
                      }
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(item.id)}
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

export default Announcement;
