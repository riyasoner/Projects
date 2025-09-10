import React, { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddSubCategories() {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const { post, get } = useApi();
  const navigate = useNavigate();
  const [subCategoryImage, setSubCategoryImage] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get(endpoints.getAllMainCategories);
        setCategoryList(response.data || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // handle image change with size validation
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {  // 5 MB
      toast.error("Image size should not exceed 5 MB");
      return;
    }
    setSubCategoryImage(file);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedParentId) {
      toast.error("Please select a parent category");
      return;
    }

    if (!subCategoryImage) {
      toast.error('Please upload a category image');
      return;
    }

    if (!subCategoryName.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }
    const form = new FormData();
    form.append("name", subCategoryName)
    form.append("mainCategoryId", selectedParentId),
      form.append("image", subCategoryImage)
    form.append("createdBy", localStorage.getItem("userId"))



    try {
      const response = await post(endpoints.createCategory, form);
      toast.success(response.message || "category added successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Select Parent Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Select Parent Category
          </label>
          <select
            id="category"
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black outline-none"
          >
            <option value="">-- Select Category --</option>
            {categoryList.map((mainCat) => (
              <option key={mainCat.id} value={mainCat.id}>
                {mainCat.name}
              </option>
            ))}
          </select>

        </div>

        {/* Subcategory Name */}
        <div className="mb-4">
          <label htmlFor="subCategoryName" className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            id="subCategoryName"
            // value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black outline-none"
            placeholder="Enter subcategory name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="subCategoryImage" className="block text-sm font-medium text-gray-700">
            Category Image
          </label>
          <input
            type="file"
            id="subCategoryImage"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black outline-none"
          />
          {subCategoryImage && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(subCategoryImage)}
                alt="Preview"
                className="h-24 w-auto object-cover rounded-md border"
              />
            </div>
          )}
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full button text-white py-2 px-4 rounded hover:bg-gray-900 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddSubCategories;
