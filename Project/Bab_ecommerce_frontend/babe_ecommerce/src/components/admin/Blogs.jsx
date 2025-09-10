import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit, FaEye } from "react-icons/fa";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { get, del, patch } = useApi();

  // Popup state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page) => {
    try {
      const response = await get(`${endpoints.getBlogs}?page=${page}`);
      setBlogs(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.page || 1);
    } catch (error) {
      console.log(error.message, "Error in Fetching Blogs");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteBlog}/${id}`);
      toast.success(response.message || "Deleted Blog");
      fetchBlogs(currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to delete Blog");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Blog?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  // Open Edit Popup
  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setStatus(blog.status); // set current status
    setIsModalOpen(true);
  };

  // Handle Status Update API
  const handleUpdateStatus = async () => {
    try {
      const response = await patch(`${endpoints.updateBlog}/${selectedBlog.id}`, {
        status,
      });
      toast.success(response.message || "Status Updated");
      setIsModalOpen(false);
      fetchBlogs(currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blogs</h2>
          <p className="text-sm text-gray-500">Manage your Blogs</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Images</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Updated At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.slug}</td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {item.images?.slice(0, 2).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="blog"
                          className="w-10 h-10 object-cover rounded"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "published"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
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
                    <div className="flex items-center gap-3">
                      {/* Edit */}
                       <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                        onClick={() => navigate("/admin/view-blog-details",{state:{id:item.id}})}
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                        onClick={() => handleEditClick(item)}
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
                <td
                  colSpan="9"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No Blogs Found
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
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-purple-700 text-white" : ""
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

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20   bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Update Blog Status</h3>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              <option value="draft">Draft </option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            </select>

            <div className="flex  justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 button text-white rounded-lg hover:bg-purple-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
