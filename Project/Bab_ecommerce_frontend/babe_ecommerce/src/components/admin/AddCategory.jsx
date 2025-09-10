import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { post } = useApi();
  const navigate = useNavigate();

  // Clean up the preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {   // 5MB limit
      toast.error("Image size should not exceed 5 MB");
      return;
    }
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName.trim() === '') {
      toast.error('Please enter a category name');
      return;
    }

    // if (!image) {
    //   toast.error('Please upload a category image');
    //   return;
    // }

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('image', image);
    formData.append('createdBy', localStorage.getItem('userId'));

    try {
      const response = await post(endpoints.createMainCategory, formData, 
       
      );

      toast.success(response.message || 'Category Added Successfully');

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to add category');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Main  Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
           Main Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 outline-none border rounded-md shadow-sm"
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
           Main Category Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full px-4 py-2 outline-none border rounded-md shadow-sm"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 w-40 h-40 object-cover border rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full button text-white py-2 px-4 rounded transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
