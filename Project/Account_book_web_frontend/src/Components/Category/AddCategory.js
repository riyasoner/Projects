import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

function AddCategory() {
  const { post } = useApi();
  const [formData, setFormData] = useState({
    category_name: "",
    upper_category: "",
    monthly_limit: "",
    userId: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await post(endPoints.addCategory, {
        ...formData,
        userId: userId,
      });
      setMessage({
        type: "success",
        text: response.message || "Category added successfully!",
      });
      setFormData({
        category_name: "",
        upper_category: "NO_PARENT",
        monthly_limit: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to add category.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h4 className="mb-4">Add New Category</h4>

      {message.text && (
        <div
          className={`alert alert-${
            message.type === "success" ? "success" : "danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            name="category_name"
            className="form-control"
            placeholder="Enter category name"
            value={formData.category_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="upperCategory" className="form-label">
            Upper Category
          </label>
          <select
            id="upperCategory"
            name="upper_category"
            className="form-select"
            value={formData.upper_category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Upper Category --</option>
            <option value="Office Expense">Office Expense</option>
            <option value="None">None</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="monthlyLimit" className="form-label">
            Monthly Limit
          </label>
          <input
            type="number"
            id="monthlyLimit"
            name="monthly_limit"
            className="form-control"
            placeholder="Enter monthly limit"
            value={formData.monthly_limit}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn text-white"
            style={{ background: "#019ED3" }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
