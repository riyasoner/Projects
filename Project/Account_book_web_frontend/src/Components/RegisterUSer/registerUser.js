import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const RegisterUser = ({ onUserCreated }) => {
  const { post } = useApi();
  const createdByUserId = localStorage.getItem("userId");

  const initialFormState = {
    name: "",
    email_id: "",
    password: "",
    phone_no: "",
    user_type: "user",
    createrBySuperAdmin: true,
    createdByUserId,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const { name, email_id, password, phone_no } = formData;

    if (!name || !email_id || !password || !phone_no) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    setLoading(true);
    try {
      const response = await post(endPoints.registration, formData);

      if (response.status) {
        setMessage({ type: "success", text: "User successfully created!" });
        setFormData(initialFormState);
        if (typeof onUserCreated === "function") onUserCreated();
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to create user.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "1300px" }}
      >
        <h4 className="mb-4 text ">Create New User</h4>

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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email_id"
              className="form-control"
              placeholder="Enter email"
              value={formData.email_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone_no"
              className="form-control"
              placeholder="Enter phone number"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">User Role</label>
            <select
              name="user_type"
              className="form-select"
              value={formData.user_type}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
