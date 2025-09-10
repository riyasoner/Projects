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
  const { get, del } = useApi();
  const userId = localStorage.getItem("userId")
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, status]);

  const fetchBlogs = async (page) => {
    try {
      const response = await get(`${endpoints.getBlogs}?status=${status}&createBy=${userId}&page=${page}`);
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

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blogs</h2>
          <p className="text-sm text-gray-500">Manage your Blogs</p>
        </div>
        <div className="w-50">
          <select name="status" id="" className=" border border-gray-400 w-50 rounded-[5px] p-2 " onChange={(e) => setStatus(e.target.value)}>
            <option>Search... </option>
            <option value="draft">Draft </option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          className="button text-white px-4 py-2 rounded-lg shadow"
          onClick={() =>
            navigate("/seller/create-blog")
          }
        >
          Add Blog
        </button>
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
                      className={`px-2 py-1 rounded text-xs font-medium ${item.status === "published"
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
                        onClick={() => navigate("/seller/view-blog-details", { state: { id: item.id } })}
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                        onClick={() =>
                          navigate("/seller/edit-blog", {
                            state: { id: item.id },
                          })
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
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-purple-700 text-white" : ""
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Blogs;
