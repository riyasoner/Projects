import React, { useEffect, useState } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";

const UserBookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const { get, del, patch } = useApi();
    const { userId } = useParams();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await get(`${endPoints.getAssignedBook}?userId=${userId}`);
            if (response?.data) {
                setBooks(response.data);
            } else {
                console.warn("No data received from API.");
            }
        } catch (err) {
            console.error("Error fetching books:", err.message || err);
            setError("Failed to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            await del(`${endPoints.deleteBook}/${bookId}`);
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        } catch (err) {
            console.error("Delete failed:", err.message || err);
            alert("Failed to delete the book.");
        }
    };

    const handleEdit = (book ) => {
        setEditingBook({ ...book });
    };

    const handleUpdate = async () => {
        try {
            const response = await patch(`${endPoints.updateBook}/${editingBook.bookId}`, editingBook);
            if (response?.status) {
                const updatedBook = response.data || editingBook;
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === updatedBook.id ? updatedBook : book
                    )
                );
                setEditingBook(null);
                alert("Book updated successfully.");
            } else {
                alert("Failed to update book.");
            }
        } catch (err) {
            console.error("Update failed:", err.message || err);
            alert("Update failed.");
        }
    };

    return (
        <div className="container mt-5">
            <h4 className="mb-3">Books List</h4>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : books.length === 0 ? (
                <p>No Assign books available.</p>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Book Name</th>
                            <th>Description</th>
                            <th>Usage Type</th>
                            <th>Usage Mode</th>
                            <th>Currency</th>
                            <th>Time Zone</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book.id}>
                                <td>{index + 1}</td>
                                <td>{book.name}</td>
                                <td>{book.description}</td>
                                <td>{book.usage_type}</td>
                                <td>{book.usage_mode}</td>
                                <td>{book.account_unit}</td>
                                <td>{book.time_zone}</td>
                                <td>{new Date(book.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(book , book.id)}
                                    >
                                        Edit
                                    </button>
                                    {/* <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        Delete
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Edit Modal */}
            {editingBook && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div
                        className="modal show fade d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Book</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setEditingBook(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {[
                                        { label: "Book Name", field: "name" },
                                        { label: "Description", field: "description" },
                                        { label: "Usage Type", field: "usage_type" },
                                        { label: "Usage Mode", field: "usage_mode" },
                                        { label: "Currency", field: "account_unit" },
                                        { label: "Time Zone", field: "time_zone" },
                                    ].map(({ label, field }) => (
                                        <div className="mb-2" key={field}>
                                            <label>{label}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingBook[field]}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                        ...editingBook,
                                                        [field]: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditingBook(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserBookList;
