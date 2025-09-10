import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const AddNewAccount = () => {
    const { post, get } = useApi();
    const [message, setMessage] = useState({ type: "", text: "" });
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        account_type: "PERSONNEL",
        unit: "inr",
        bookId: localStorage.getItem("bookId") || "",
        userId: ""
    });
    const userId = localStorage.getItem("userId")
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error when typing
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.userId) newErrors.userId = "Owner selection is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setMessage({ type: "", text: "" });

        const currentBookId = localStorage.getItem("bookId");
        const dataToSend = {
            ...formData,
            bookId: currentBookId,
            userId: Number(formData.userId),
        };

        try {
            const response = await post(endPoints.addAccount, dataToSend);
            if (response?.data) {
                setMessage({ type: "success", text: response.message || "Account added successfully!" });
                setFormData({
                    name: "",
                    description: "",
                    account_type: "PERSONNEL",
                    unit: "inr",
                    bookId: currentBookId || "",
                    userId: ""
                });
                setErrors({});
            } else {
                setMessage({ type: "error", text: response.message || "Failed to add account. Please try again." });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error?.message || "An unexpected error occurred." });
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await get(`${endPoints.getAllUser}?createdByUserId=${userId}`);
                setUsers(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="container mt-5" style={{ maxWidth: "1000px" }}>
            <div className="card mx-auto">
                <div className="card-header d-flex align-items-center" style={{ backgroundColor: "#419EB9" }}>
                    <h6 className="text-white">NEW ACCOUNT</h6>
                </div>

                {message.text && (
                    <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} m-3`}>
                        {message.text}
                    </div>
                )}

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                style={{ border: "none" }}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <hr />
                        <div className="mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                style={{ border: "none" }}
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>
                        <hr />
                        <div className="mb-3 row">
                            <div className="col-md-6 mb-3">
                                <select
                                    className="form-select"
                                    name="account_type"
                                    value={formData.account_type}
                                    onChange={handleChange}
                                >
                                    <option value="PAYABLE_RECEIVABLE">PAYABLE/RECEIVABLE</option>
                                    <option value="BANK">BANK</option>
                                    <option value="CREDIT_CARD">CREDIT CARD</option>
                                    <option value="CASH">CASH</option>
                                    <option value="PERSONNEL">PERSONNEL</option>
                                    <option value="PRODUCT">PRODUCT</option>
                                    <option value="SAVINGS">SAVINGS</option>
                                    <option value="NONE">NONE</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <select
                                    className="form-select"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                >
                                    <option value="usd">$ United States Dollar (USD)</option>
                                    <option value="eur">€ Euro (EUR)</option>
                                    <option value="gbp">£ Pound Sterling (GBP)</option>
                                    <option value="inr">₹ Indian Rupee (INR)</option>
                                    <option value="jpy">¥ Japanese Yen (JPY)</option>
                                    <option value="aud">$ Australian Dollar (AUD)</option>
                                    <option value="cad">$ Canadian Dollar (CAD)</option>
                                    <option value="chf">CHF Swiss Franc (CHF)</option>
                                    <option value="cny">¥ Chinese Yuan (CNY)</option>
                                    <option value="ron">L Romanian Leu (RON)</option>
                                    <option value="zar">R South African Rand (ZAR)</option>
                                    <option value="sgd">$ Singapore Dollar (SGD)</option>
                                    <option value="hkd">$ Hong Kong Dollar (HKD)</option>
                                    <option value="nzd">$ New Zealand Dollar (NZD)</option>
                                    <option value="brl">R$ Brazilian Real (BRL)</option>
                                    <option value="sek">kr Swedish Krona (SEK)</option>
                                    <option value="nok">kr Norwegian Krone (NOK)</option>
                                    <option value="dkk">kr Danish Krone (DKK)</option>
                                    <option value="mxn">$ Mexican Peso (MXN)</option>
                                    <option value="rub">₽ Russian Ruble (RUB)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <select
                                className={`form-select ${errors.userId ? "is-invalid" : ""}`}
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Account Owner --</option>
                                {users
                                    .filter(user => user.user_type !== "super_admin")
                                    .map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email_id})
                                        </option>
                                    ))}
                            </select>
                            {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
                        </div>

                        <hr />
                        <div className="d-flex justify-content-end mt-3">
                            <button
                                type="submit"
                                className="btn btn-lg"
                                style={{ backgroundColor: "#419EB9", color: "white" }}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNewAccount;
