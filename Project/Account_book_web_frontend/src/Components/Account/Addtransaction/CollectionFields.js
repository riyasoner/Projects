// components/AddTransaction/CollectionFields.js

function CollectionFields({ formData, handleChange }) {
  return (
    <div className="row mt-3">
      <div className="col-md-3">
        <select
          className="form-select"
          value={formData.collKishtType}
          onChange={handleChange}
          name="collKishtType"
          required
        >
          <option value="">Select Repayment Type</option>
          {[
            "monthly",
            "2_monthly",
            "3_monthly",
            "6_monthly",
            "weekly",
            "2_weekly",
            "3_weekly",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={formData.collEmiTimes}
          onChange={handleChange}
          name="collEmiTimes"
          required
        >
          <option value="">Continuously</option>
          {[...Array(60)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Times
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <input
          type="number"
          className="form-control"
          placeholder="Total Amount"
          value={formData.collTotalAmount}
          onChange={handleChange}
          name="collTotalAmount"
          min="0"
        />
      </div>
      <div className="col-md-3">
        <input
          type={formData.collEmiDueDate ? "date" : "text"}
          className="form-control"
          placeholder="Due Date"
          value={formData.collEmiDueDate}
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => !e.target.value && (e.target.type = "text")}
          onChange={handleChange}
          name="collEmiDueDate"
        />
      </div>
    </div>
  );
}

export default CollectionFields;
