// components/AddTransaction/AddTransactionButton.js

function AddTransactionButton({ onClick, loading }) {
  return (
    <div className="col-md-1">
      <button
        className="btn btn-primary w-100"
        style={{ marginTop: "30px" }}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export default AddTransactionButton;
