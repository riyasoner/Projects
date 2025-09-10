import React, { useState, useEffect } from "react";
import endPoints from "../../api/endPoints"
import useApi from "../../hooks/useApi";
function EditTransactionForm({ transaction, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
    amount: "",
  });
const {patch} = useApi();
  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.transaction_date?.slice(0, 10) || "",
        time: transaction.transaction_time || "",
        description: transaction.description || "",
        amount: transaction.amount || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        transaction_date: formData.date,
        transaction_time: formData.time,
        description: formData.description,
        amount: formData.amount,
      };

      const response = await patch(
        `${endPoints.updateTransaction}/${transaction.id}`,
        payload
      );

      if (!response.status) {
        alert("Failed to update transaction.");
        return;
      }

      alert("Transaction updated successfully!");

      onSave(); // Refresh list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error while updating:", error);
      // alert("An error occurred while updating the transaction.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Date</label>
        <input
          type="date"
          name="date"
          className="form-control"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* <div className="mb-3">
        <label className="form-label">Time</label>
        <input
          type="time"
          name="time"
          className="form-control"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>
 */}
      <div className="mb-3">
        <label className="form-label">Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Amount</label>
        <input
          type="number"
          name="amount"
          className="form-control"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditTransactionForm;
