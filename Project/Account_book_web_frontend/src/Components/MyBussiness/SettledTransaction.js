import { useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

export default function SettledTransactionForm({ accountId, onClose }) {
  const { post } = useApi();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    selectedDate: "",
    from_date: "",
    to_date: "",
    acc_setled_date: today,
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const bookId = localStorage.getItem("bookId");
  const userId = localStorage.getItem("userId"); // if needed later

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "selectedDate") {
        return {
          ...prev,
          selectedDate: value,
          from_date: "",
          to_date: "",
        };
      }

      if (name === "from_date" || name === "to_date") {
        return {
          ...prev,
          [name]: value,
          selectedDate: "",
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selectedDate && (!formData.from_date || !formData.to_date)) {
      return setError("Please select either a single date or a date range.");
    }

    const payload = {
      accountId: Number(accountId), // ✅ ensure number
      bookId: Number(bookId),   
      userId,    // ✅ ensure number
      acc_setled_date: formatDate(formData.acc_setled_date),
    };

    if (formData.selectedDate) {
      payload.selectedDate = formatDate(formData.selectedDate);
    } else if (formData.from_date && formData.to_date) {
      payload.from_date = formatDate(formData.from_date);
      payload.to_date = formatDate(formData.to_date);
    }

    try {
      const response = await post(endPoints.accountSettled, payload);

      if (response.status) {
        setMessage(response.message || "Transaction settled successfully!");
        setError(null);
        setTimeout(()=>{
          onClose();

        },[2000])
      } else {
        setError(response.message || "Failed to settle the transaction.");
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    }
  };

  const isSelectedDatePicked = !!formData.selectedDate;
  const isRangePicked = !!formData.from_date || !!formData.to_date;

  return (
    <div className="container mt-4">
      <h5>Settle Transaction</h5>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">From Date</label>
          <input
            type="date"
            name="from_date"
            className="form-control"
            value={formData.from_date}
            onChange={handleChange}
            disabled={isSelectedDatePicked}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">To Date</label>
          <input
            type="date"
            name="to_date"
            className="form-control"
            value={formData.to_date}
            onChange={handleChange}
            disabled={isSelectedDatePicked}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Selected Date</label>
          <input
            type="date"
            name="selectedDate"
            className="form-control"
            value={formData.selectedDate}
            onChange={handleChange}
            disabled={isRangePicked}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Settled Date</label>
          <input
            type="date"
            name="acc_setled_date"
            className="form-control"
            value={formData.acc_setled_date}
            onChange={handleChange}
            max={today}
            required
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
