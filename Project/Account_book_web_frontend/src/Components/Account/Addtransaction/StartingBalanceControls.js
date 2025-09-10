// components/AddTransaction/StartingBalanceControls.js

function StartingBalanceControls({ formData, setFormData }) {
  return (
    <div className="row mt-3">
      <div className="col-md-7 d-flex">
        <button
          type="button"
          className={`btn rounded fw-bold me-2 w-50 ${
            formData.startingBalanceOperation === "add"
              ? "btn-primary"
              : "btn-outline-secondary"
          }`}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              startingBalanceOperation: "add",
            }))
          }
        >
          ➕ Add
        </button>
        <button
          type="button"
          className={`btn rounded fw-bold ms-2 w-50 ${
            formData.startingBalanceOperation === "subtract"
              ? "btn-danger"
              : "btn-outline-secondary"
          }`}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              startingBalanceOperation: "subtract",
            }))
          }
        >
          ➖ Subtract
        </button>
      </div>
    </div>
  );
}

export default StartingBalanceControls;
