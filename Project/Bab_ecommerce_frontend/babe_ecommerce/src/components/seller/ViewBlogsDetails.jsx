import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useLocation, useNavigate } from "react-router-dom";
import endpoints from "../../api/endpoints";
import { FaArrowLeft } from "react-icons/fa";

function ViewBlogDetails() {
  const { get } = useApi();
  const { state } = useLocation();
  const id = state?.id;
  const [blog, setBlog] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    if (id) fetchBlogById();
  }, [id]);

  const fetchBlogById = async () => {
    try {
      const res = await get(`${endpoints.getBlogById}/${id}`); // endpoints.getBlogById ke hisaab se adjust karlo
      setBlog(res.data || {});
    } catch (error) {
      console.log("Error fetching blog by id", error);
    }
  };

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading Blog Details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
           <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2
                       px-4 py-2 rounded
                       bg-gray-200 text-gray-700
                       hover:bg-gray-300 active:bg-gray-400
                       transition-colors"
          >
            <FaArrowLeft size={14} />
            Back
          </button>
        </div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Blog Header */}
        <div className="px-6 py-6 bg-purple text-white">
          <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
          <p className="text-sm opacity-80">{blog.excerpt}</p>
        </div>

        {/* Images */}
        {blog.images && blog.images.length > 0 && (
          <div className="flex gap-4 overflow-x-auto p-4 bg-gray-50">
            {blog.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Blog ${idx + 1}`}
                className="w-60 h-40 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        )}

        {/* Blog Info Table */}
        <div className="p-6">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b bg-gray-50">
                <td className="p-3 font-semibold w-1/3">ID</td>
                <td className="p-3">{blog.id}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Slug</td>
                <td className="p-3">{blog.slug}</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-3 font-semibold">Description</td>
                <td className="p-3">{blog.description}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Category ID</td>
                <td className="p-3">{blog.categoryId}</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-3 font-semibold">Product ID</td>
                <td className="p-3">{blog.productId}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Status</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      blog.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </span>
                </td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-3 font-semibold">Views</td>
                <td className="p-3">{blog.views}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Meta Title</td>
                <td className="p-3">{blog.metaTitle}</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-3 font-semibold">Meta Description</td>
                <td className="p-3">{blog.metaDescription}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Meta Keywords</td>
                <td className="p-3">{blog.metaKeywords}</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-3 font-semibold">Created At</td>
                <td className="p-3">
                  {new Date(blog.createdAt).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-gray-50">Updated At</td>
                <td className="p-3">
                  {new Date(blog.updatedAt).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewBlogDetails;
