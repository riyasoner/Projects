import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const BookEdit = ({ onClose }) => {
    const [bookData, setBookData] = useState({
        name: "",
        description: "",
        usage_type: "",
        usage_mode: "",
        account_unit: "",
        time_zone: "",
        hide_account: false,
        createdAt: "",
    });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const { get, patch } = useApi();
    const bookId = localStorage.getItem("bookId");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!bookId) {
                setIsError(true);
                setMessage("Book ID is missing.");
                return;
            }
            try {
                const response = await get(`${endPoints.getBookById}/${bookId}`);
                if (response.status) {
                    setBookData(response.data.bookDetails);
                } else {
                    setIsError(true);
                    setMessage(response?.message || "Failed to fetch book details.");
                }
            } catch (err) {
                setIsError(true);
                setMessage("A network error occurred. Please try again later.");
            }
        };
        fetchBookDetails();
    }, [bookId, get]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBookData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!bookId) {
            setIsError(true);
            setMessage("Book ID is missing.");
            return;
        }

        try {
            const response = await patch(`${endPoints.updateBook}/${bookId}`, bookData);
            if (response?.status) {
                setIsError(false);
                setMessage("Book  updated successfully.");
            } else {
                setIsError(true);
                setMessage(response?.message || "An error occurred while updating the book.");
            }
        } catch (err) {
            setIsError(true);
            setMessage("A network error occurred. Please try again later.");
        }
    };
console.log(bookData)
    return (
        <div className="book-edit-container">
            {message && (
                <div className={`alert ${isError ? "alert-danger" : "alert-success"}`} role="alert">
                    {message}
                </div>
            )}
            <div className="card">
                <div className="card-header text-white" style={{ backgroundColor: "#419EB9" }}>
                    <h5>EDIT BOOK</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Book Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={bookData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={bookData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <hr />
                        <div className="mb-3">
                            <h6>SETTINGS</h6>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Account Unit</td>
                                        <td>{bookData.account_unit || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td>Usage Type</td>
                                        <td>{bookData.usage_type || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td>Usage Mode</td>
                                        <td>{bookData.usage_mode || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td>Timezone</td>
                                        <td>{bookData.time_zone || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td>Date</td>
                                        <td>{new Date(bookData.createdAt).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Update</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookEdit;
