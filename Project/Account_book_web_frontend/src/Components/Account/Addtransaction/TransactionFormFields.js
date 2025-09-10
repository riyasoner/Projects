// components/AddTransaction/TransactionFormFields.js
import SearchableAccountSelect from "./SearchableAccountSelect";
function TransactionFormFields({
  formData,
  handleChange,
  categories,
  accounts,
  accountId,
}) {
  const showToAccount = !["INCOME", "EXPENSE", "STARTING_BALANCE"].includes(
    formData.transactionType
  );

  return (
    <>
      {/* Description */}
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          name="description"
          required
        />
      </div>

      {/* Date */}
      <div className="col-md-2">
        <input
          type="datetime-local"
          className="form-control"
          value={formData.transactionDate}
          onChange={handleChange}
          name="transactionDate"
        />
      </div>

      {/* Category */}
      <div className="col-md-2">
        <select
          className="form-select"
          value={formData.category}
          onChange={handleChange}
          name="category"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.id} value={cat.category_name}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* To Account */}
      {showToAccount && (
        <div className="col-md-2">
          <SearchableAccountSelect
            accounts={accounts}
            value={formData.toAccount}
            accountId={accountId}
            onChange={(val) =>
              handleChange({
                target: {
                  name: "toAccount",
                  value: val,
                },
              })
            }
          />
        </div>
      )}

      {/* Amount */}
      <div className="col-md-2">
        <input
          type="number"
          className="form-control text-end fw-bold"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          name="amount"
          min="0"
          required
        />
      </div>
    </>
  );
}

export default TransactionFormFields;
