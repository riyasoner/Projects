import React, { useState } from "react";
import axios from "axios";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const AddBook = ({ onClose, fetchBooks }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const { post } = useApi();
    const createdByUserId = localStorage.getItem("userId")
    const handleSave = async () => {
        const payload = {
            name,
            description,
            usage_type: "home budget",
            usage_mode: "simple",
            account_unit: "kg",
            time_zone: "india",
            hide_account: false,
            createrBySuperAdmin:true,
            createdByUserId
        };

        try {
            const response = await post(endPoints.addBook, payload);
            setMessage("Book created successfully!");
            setName("");
            setDescription("");
            fetchBooks();

        } catch (error) {
            setMessage("Error saving book. Please try again.");
            console.error("Error saving book:", error);
        }
    };

    return (
        <>
            {message && <p style={{ color: "green", textAlign: "start" }}>{message}</p>}
            <div
                style={{
                    border: "1px solid #ccc",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    maxWidth: "500px",
                    padding: "15px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#419EB9",
                        padding: "5px",
                        color: "white",
                    }}
                >
                    <span>New Book</span>
                </div>
                <form>
                    <div className="mb-3 mt-2">
                        <input
                            type="text"
                            id="bookName"
                            className="form-control"
                            placeholder="Name"
                            style={{ border: "none" }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <hr />
                    <div className="mb-3 mt-2">
                        <input
                            type="text"
                            id="bookDescription"
                            className="form-control"
                            placeholder="Description"
                            style={{ border: "none" }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            {/* Save Button */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    maxWidth: "500px",
                }}
            >
                <button
                    type="button"
                    className="btn mt-2"
                    style={{ backgroundColor: "#419EB9", color: "white" }}
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </>
    );
};

export default AddBook;
