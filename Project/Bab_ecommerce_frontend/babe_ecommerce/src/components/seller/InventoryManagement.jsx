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

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showProductStockModal, setShowProductStockModal] = useState(null);
  const [showVariantStockModal, setShowVariantStockModal] = useState(null);
  const { get, del,patch } = useApi();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await get(`${endpoints.getAllProducts}?sellerId=${userId}&page=${page}`);
      const filteredProducts = (response.data || []).filter(p => p.stock <= 120);
      setProducts(filteredProducts);
      setTotalPages(response?.totalPages || 1);
      setCurrentPage(response?.currentPage || 1);
    } catch (error) {
      console.log(error.message, "Error in Fetching Products");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteProductById}/${id}`);
      toast.success(response.message || "Product deleted");
      fetchProducts(currentPage);
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
    });
  };

  const updateProductStock = async (productId, stock) => {
    try {
      const res = await patch(`${endpoints.updateProductById}/${productId}`, 
       { stock: Number(stock) })
     
     
      toast.success(res.message || "Product stock updated");
      setShowProductStockModal(null);
      fetchProducts(currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to update product stock");
    }
  };

  const updateVariantStock = async (variantId, stock) => {
    try {
      const res = await patch(`${endpoints.updateVariant}/${variantId}`,
        { stock: Number(stock) })
      
      
      toast.success(res.message || "Variant stock updated");
      setShowVariantStockModal(null);
      fetchProducts(currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to update variant stock");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 satosi_bold">Inventory Management</h2>
        <p className="text-sm text-gray-500">Manage your Inventory</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Link</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
              {/* <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th> */}
              <th className="px-4 py-3  text-gray-600">Product Stock</th>

               <th className="px-4 py-3 text-left font-medium text-gray-600">Add Variant Stock</th>
               <th className="px-4 py-3 text-left font-medium text-gray-600">Add Product Stock</th>
              
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
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
                  <td className=" py-5 px-4 flex items-center gap-2">
                    <span className="truncate max-w-[150px]"></span>
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
                  <td className="px-4 py-3 ">{product?.stock || 0}</td>
                 
                  <td className="px-4 py-3 ">
                    <button
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => setShowVariantStockModal(product)}
                      title="Edit Variant Stock"
                    >
                      <FiEdit size={16} />
                    </button>
                  </td>

                   <td className="px-4 py-3">
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => setShowProductStockModal(product)}
                      title="Edit Product Stock"
                    >
                      <FaPlus size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">No low stock products found.</td>
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

      {/* Product Stock Modal */}
      {showProductStockModal && (
        <ProductStockModal
          product={showProductStockModal}
          onClose={() => setShowProductStockModal(null)}
          onSave={updateProductStock}
        />
      )}

      {/* Variant Stock Modal */}
      {showVariantStockModal && (
        <VariantStockModal
          product={showVariantStockModal}
          onClose={() => setShowVariantStockModal(null)}
          onSave={updateVariantStock}
        />
      )}
    </div>
  );
};

// Product Stock Modal Component
const ProductStockModal = ({ product, onClose, onSave }) => {
  const [stock, setStock] = useState(product.stock || 0);

  const handleSave = () => onSave(product.id, stock);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[350px]">
        <h3 className="text-xl font-bold mb-4">Edit Product Stock</h3>
        <input
          type="number"
          className="border px-3 py-2 w-full mb-4"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={handleSave}>Update</button>
        </div>
      </div>
    </div>
  );
};

// Variant Stock Modal Component
const VariantStockModal = ({ product, onClose, onSave }) => {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id || "");
  const [stock, setStock] = useState("");

  const handleSave = () => {
    if (!selectedVariantId || stock === "") {
      toast.error("Please select a variant and enter stock.");
      return;
    }
    onSave(selectedVariantId, stock);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[350px]">
        <h3 className="text-xl font-bold mb-4">Edit Variant Stock</h3>
        <select
          className="border w-full px-3 py-2 mb-4"
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
        >
          {product.variants?.map((v) => (
            <option key={v.id} value={v.id}>
              {v.variantName} - {v.size} - Current: {v.stock}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border px-3 py-2 w-full mb-4"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Enter new stock"
        />

        <div className="flex justify-end gap-2">
          <button className="px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={handleSave}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
