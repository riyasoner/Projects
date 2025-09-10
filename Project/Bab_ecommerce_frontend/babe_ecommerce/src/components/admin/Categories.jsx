import React, { useEffect, useState } from "react";
import { FaFileCsv, FaPlus, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Categories = () => {
  const navigate = useNavigate();
  const { get, del, patch } = useApi();

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);
  const [currentCategoryType, setCurrentCategoryType] = useState(null);



  const fetchCategories = async (page = 1) => {
    try {
      const response = await get(`${endpoints.getAllMainCategories}?page=${page}`);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(pagination.currentPage);
  }, [pagination.currentPage]);

 const handleExport = () => {
  if (!categories.length) {
    toast.warning("No data to export");
    return;
  }

  const exportData = [];

  categories.forEach((mainCat) => {
    // Main Category
    exportData.push({
      ID: mainCat.id,
      Name: mainCat.name,
      Slug: mainCat.slug,
      Status: mainCat.isActive ? "Active" : "Inactive",
      Type: "Main Category",
      Parent: "-",
      Created: new Date(mainCat.createdAt).toLocaleDateString(),
    });

    // Categories inside Main Category
    mainCat.categories?.forEach((cat) => {
      exportData.push({
        ID: cat.id,
        Name: cat.name,
        Slug: cat.slug,
        Status: cat.isActive ? "Active" : "Inactive",
        Type: "Category",
        Parent: mainCat.name,
        Created: new Date(cat.createdAt).toLocaleDateString(),
      });

      // Subcategories inside Category
      cat.subCategories?.forEach((sub) => {
        exportData.push({
          ID: sub.id,
          Name: sub.name,
          Slug: sub.slug,
          Status: sub.isActive ? "Active" : "Inactive",
          Type: "Subcategory",
          Parent: cat.name,
          Created: new Date(sub.createdAt).toLocaleDateString(),
        });
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(data, "categories_export.xlsx");
};


  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };


  const handleDeleteMain = async (id) => {
    try {
      const res = await del(`${endpoints.deleteMainCategory}/${id}`);
      toast.success(res.message);
      // setCategories((prev) => prev.filter((item) => item.id !== id));
      fetchCategories()
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleDeleteCat = async (id) => {
    try {
      const res = await del(`${endpoints.deleteCategory}/${id}`);
      toast.success(res.message);
     fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteSub = async (id) => {
    try {
      const res = await del(`${endpoints.deleteSubCategory}/${id}`);
      toast.success(res.message);
      // setCategories((prev) => prev.filter((item) => item.id !== id));
      fetchCategories()
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openEditModal = (category, type) => {
    setCurrentCategory(category);
    setUpdatedName(category.name);
    setIsModalOpen(true);
    setUpdatedImage(null); // optional: reset
    setCurrentCategoryType(type); // "main" | "category" | "sub"
    setActiveDropdown(null);
  };



  const handleDeleteClickMain = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this category?",
      buttons: [
        { label: "Yes", onClick: () => handleDeleteMain(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  const handleDeleteClickCat = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this category?",
      buttons: [
        { label: "Yes", onClick: () => handleDeleteCat(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  const handleDeleteClickSub = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this subcategory?",
      buttons: [
        { label: "Yes", onClick: () => handleDeleteSub(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  const handleGenericUpdate = async () => {
    if (!updatedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", updatedName);
      if (updatedImage) form.append("image", updatedImage);

      let endpoint = "";
      if (currentCategoryType === "main") {
        endpoint = `${endpoints.updateMainCategory}/${currentCategory.id}`;
      } else if (currentCategoryType === "category") {
        endpoint = `${endpoints.updateCategory}/${currentCategory.id}`;
      } else if (currentCategoryType === "sub") {
        endpoint = `${endpoints.updateSubCategory}/${currentCategory.id}`;
      }

      await patch(endpoint, form);
      toast.success(`${currentCategoryType} category updated successfully`);
      setIsModalOpen(false);
      fetchCategories(pagination.currentPage);
    } catch (error) {
      toast.error(error.message || "Failed to update");
    }
  };



  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories Management</h2>
        <p className="text-sm text-gray-500">Manage your product categories</p>
      </div>

      <div className="flex justify-end gap-3 mb-5">
        <button onClick={handleExport} className="flex items-center gap-2 bg-gray-100 text-sm px-4 py-2 rounded hover:bg-gray-200 transition">
          <FaFileCsv className="text-gray-600" />
          Export CSV
        </button>
        <button onClick={() => navigate("/admin/add_category")} className="flex items-center gap-2 text-sm px-4 py-2 rounded button transition">
          <FaPlus />
          Add Main Category
        </button>
        <button onClick={() => navigate("/admin/add_sub_category")} className="flex items-center gap-2 bg-gray-100 text-sm px-4 py-2 rounded hover:bg-gray-200 transition">
          <FaPlus />
          Add Category
        </button>
        <button onClick={() => navigate("/admin/add_sub_subcategory")} className="flex items-center gap-2 bg-gray-100 text-sm px-4 py-2 rounded hover:bg-gray-200 transition">
          <FaPlus />
          Add Subcategory
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Main Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((mainCat) => (
                <React.Fragment key={`main-${mainCat.id}`}>

                  {/* Main Category Row */}
                  <tr className="bg-blue-50">

                    <td className="px-4 py-3 font-bold text-blue-800">{mainCat.name}</td>
                    <td className="px-4 py-3 text-blue-600">{mainCat.slug}</td>
                    <td className="px-4 py-3 text-green-600">{mainCat.isActive ? "Active" : "Inactive"}</td>
                    <td></td>
                    <td className="px-4 py-3">{new Date(mainCat.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 relative">
                      <button className="p-1 rounded hover:bg-gray-200" onClick={() => toggleDropdown(mainCat.id)}>
                        <FaEllipsisV className="text-gray-500 cursor-pointer" />
                      </button>
                      {activeDropdown === mainCat.id && (
                        <div className="absolute right-0 mt-2 bottom-10 w-40 bg-white border rounded shadow-md z-10">
                          <button onClick={() => openEditModal(mainCat, "main")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">✏️ Edit</button>
                          <button onClick={() => handleDeleteClickMain(mainCat.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">🗑️ Delete</button>
                        </div>
                      )}
                    </td>

                  </tr>

                  {/* Categories inside Main Category */}
                  {mainCat.categories?.map((cat) => (
                    <React.Fragment key={`cat-${cat.id}`}>
                      <tr className="border-t bg-gray-50 hover:bg-gray-100 transition">
                        <td className="px-4 py-3 pl-6 font-semibold text-green-700">↳ {cat.name}</td>
                        <td className="px-4 py-3">{cat.slug}</td>
                        <td className="px-4 py-3 text-green-600">{cat.isActive ? "Active" : "Inactive"}</td>
                        <td className="px-4 py-3">{mainCat.name}</td>
                        <td className="px-4 py-3">{new Date(cat.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 relative">
                          <button className="p-1 rounded hover:bg-gray-200" onClick={() => toggleDropdown(cat.id)}>
                            <FaEllipsisV className="text-gray-500 cursor-pointer" />
                          </button>
                          {activeDropdown === cat.id && (
                            <div className="absolute right-0 bottom-10 mt-2 w-40 bg-white border rounded shadow-md z-10">
                              <button onClick={() => openEditModal(cat, "category")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">✏️ Edit</button>
                              <button onClick={() => handleDeleteClickCat(cat.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">🗑️ Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Subcategories inside Category */}
                      {cat.subCategories?.map((sub) => (
                        <tr key={`sub-${sub.id}`} className="border-t bg-gray-100 hover:bg-gray-200 transition">
                          <td className="px-4 py-3 pl-12 text-gray-700">↳↳ {sub.name}</td>
                          <td className="px-4 py-3">{sub.slug}</td>
                          <td className="px-4 py-3 text-green-600">{sub.isActive ? "Active" : "Inactive"}</td>
                          <td className="px-4 py-3">{mainCat.name}</td>
                          <td className="px-4 py-3">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 relative">
                            <button className="p-1 rounded hover:bg-gray-200" onClick={() => toggleDropdown(sub.id)}>
                              <FaEllipsisV className="text-gray-500 cursor-pointer" />
                            </button>
                            {activeDropdown === sub.id && (
                              <div className="absolute right-0 bottom-10 mt-2 w-40 bg-white border rounded shadow-md z-10">
                                <button onClick={() => openEditModal(sub, "sub")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">✏️ Edit</button>
                                <button onClick={() => handleDeleteClickSub(sub.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">🗑️ Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No categories found.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">Page {pagination.currentPage} of {pagination.totalPages}</p>
        <div className="flex gap-2">
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 border rounded ${pagination.currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}>{i + 1}</button>
          ))}
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>

            {/* Category Name Input */}
            <input
              type="text"
              className="w-full border px-4 py-2 rounded mb-4"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Enter category name"
            />

            {/* Image Input */}
            <input
              type="file"
              className="w-full border px-4 py-2 rounded mb-4"
              accept="image/*"
              onChange={(e) => setUpdatedImage(e.target.files[0])}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleGenericUpdate}
                className="px-4 py-2 rounded button text-white hover:bg-gray-900"
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

export default Categories;
