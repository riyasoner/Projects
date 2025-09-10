import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

function AddTransaction() {
    const { post, get } = useApi();
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });
    const bookId = localStorage.getItem("bookId");
    const userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        transaction_type: "INCOME",
        transaction_date: "",
        transaction_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time in HH:mm format
        category: "",
        description: "",
        to_account: "",
        amount: "",
        account_type: "PAYABLE_RECEIVABLE",
        starting_balance: false,
        accountId: null,
        bookId: bookId,
        userId,
        // Additional collection fields
        coll_kisht_type: "",
        coll_total_amount: "",
        coll_emiDue_date: "",
        coll_emi_times: ""
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            const response = await post(endPoints.addTransaction, formData);
            if (response) {
                setMessage({ type: "success", text: "Transaction added successfully!" });
                setFormData({ ...formData, transaction_date: "", category: "", description: "", to_account: "", amount: "" });
            } else {
                setMessage({ type: "error", text: "Failed to add transaction. Please try again." });
            }
        } catch (error) {
            setMessage({ type: "error", text: error?.message || "An unexpected error occurred." });
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await get(endPoints.getCategories);
            setCategories(response?.data || []);
        } catch {
            setCategories([]);
        }
    };

    const fetchAccounts = async () => {
        try {
            const bookId = localStorage.getItem("bookId");
            const params = bookId ? { bookId } : {};

            const response = await get(endPoints.getAllAccounts, { params });

            setAccounts(response?.data || []);
        } catch {
            setAccounts([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchAccounts();
    }, []);

    return (
        <div className="card shadow mt-5 mx-auto" style={{ width: "1000px" }}>
            <div className="card-header d-flex justify-content-between align-items-center text-white" style={{ background: "#419EB9" }}>
                <h6 className="mb-0">NEW TRANSACTION</h6>
                <button className="btn btn-link text-white p-0" style={{ textDecoration: "none" }}>
                    {/* Set as Notification <i className="bi bi-bell"></i> */}
                </button>
            </div>

            {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} m-3`}>
                    {message.text}
                </div>
            )}

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Transaction Type</label>
                        <select className="form-select" name="transaction_type" value={formData.transaction_type} onChange={handleChange}>
                            {[
                                "INCOME",

                                "EXPENSE",
                                "PURCHASE",

                                "COLLECTION",
                                "PAYMENT",
                                "TRANSFER",
                                "ADD",
                                "SUBTRACT"
                            ].map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    {formData.transaction_type === "COLLECTION" && (
                        <>
                            <div className="mb-3">
                                <label className="form-label"> Type</label>
                                <select className="form-select" name="coll_kisht_type" value={formData.coll_kisht_type} onChange={handleChange}>
                                    <option value="">Select Type</option>
                                    {["monthly", "2_monthly", "3_monthly", " 6_monthly", "weekly", "2_weekly", "3_weekly"].map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        )
                                    )}

                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Total EMI Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="coll_total_amount"
                                    value={formData.coll_total_amount}
                                    onChange={handleChange}
                                    placeholder="Enter total EMI amount"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">EMI Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="coll_emiDue_date"
                                    value={formData.coll_emiDue_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Number of EMIs</label>
                                {/* 
    <input
        type="number"
        className="form-control"
        name="collEmiTimes"
        value={formData.collEmiTimes}
        onChange={handleChange}
        placeholder="e.g. 5"
    /> 
    */}
                                <select
                                    className="form-select"
                                    name="coll_emi_times"
                                    value={formData.coll_emi_times}
                                    onChange={handleChange}
                                >
                                    <option value="">Continuously</option>
                                    {[...Array(60)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1} {i + 1 === 1 ? "Time" : "Times"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Transaction Date</label>
                        <input type="date" className="form-control" name="transaction_date" value={formData.transaction_date} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        {categories.length > 0 ? (
                            <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.category_name}>{category.category_name}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-muted">No categories available</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} placeholder="Enter a description" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Target Account</label>
                        <select className="form-select" name="to_account" value={formData.to_account} onChange={handleChange} disabled={accounts.length === 0}>
                            <option value="" disabled>Select Account</option>
                            {accounts.length > 0 ? (
                                <>
                                    {accounts.map((accountGroup) =>
                                        accountGroup.accounts.map((account) => (
                                            <option key={account.id} value={account.id}>{account.name} ({account.netProfit} ₹)</option>
                                        ))
                                    )}
                                    <option value="Others">Others</option>
                                </>
                            ) : (
                                <option value="" disabled>No accounts available</option>
                            )}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Source Account</label>
                        <select
                            className="form-select"
                            name="accountId"
                            value={formData.accountId || ""}  // Ensure default empty value
                            onChange={handleChange}
                            disabled={accounts.length === 0}
                        >
                            <option value="" disabled>Select Account</option>
                            {accounts.length > 0 ? (
                                <>
                                    {accounts.map((accountGroup) =>
                                        accountGroup.accounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.name} ({account.netProfit} ₹)
                                            </option>
                                        ))
                                    )}
                                    <option value="Others">Others</option>
                                </>
                            ) : (
                                <option value="" disabled>No accounts available</option>
                            )}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <div className="input-group">
                            <span className="input-group-text">₹</span>
                            <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleChange} placeholder="0" />
                        </div>
                    </div>


                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTransaction;
