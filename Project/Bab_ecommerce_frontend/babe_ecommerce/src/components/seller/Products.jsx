import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit, FiCopy } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { get, del } = useApi();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await get(`${endpoints.getAllProducts}?sellerId=${userId}&page=${page}`);
      setProducts(response.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setCurrentPage(response.data?.currentPage || 1);
    } catch (error) {
      console.log(error.message, "Error in Fetching Products");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteProductById}/${id}`);
      toast.success(response.message || "Product deleted");
      fetchProducts(currentPage); // Refresh list
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this product?",
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
        <h2 className="text-2xl font-bold text-gray-800 satosi_bold">Products Management</h2>
        <p className="text-sm text-gray-500">Manage your products</p>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-end gap-3 mb-5">
        <button
          onClick={() => navigate("/seller/add_product")}
          className="flex items-center gap-2 button text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <FaPlus />
          Add Products
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Link</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products.length>0)?products.map((product, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-3">{product.title}</td>
                <td className="px-4 py-3">{product.slug}</td>
                <td
                  className={`px-4 py-3 capitalize font-semibold ${
                    product.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.status}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="truncate max-w-[150px]">{product?.shareableLink}</span>
                  <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => {
                      navigator.clipboard.writeText(product?.shareableLink);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <FiCopy size={18} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/seller/view_product/${product.id}`)}
                  >
                    <AiOutlineEye size={18} />
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-800"
                    onClick={() => navigate(`/seller/edit_product/${product.id}`)}
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </td>
              </tr>
            )):(<tr ><td colSpan={"10"} className="text-center">Not Found</td></tr>)}
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
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-purple-700 text-white" : ""
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

export default Products;
