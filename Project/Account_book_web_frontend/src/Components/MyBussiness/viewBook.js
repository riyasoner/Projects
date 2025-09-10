import React, { useEffect, useState } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBook, setEditingBook] = useState(null); // For edit modal
    const { get, del, patch } = useApi();
    const createdByUserId = localStorage.getItem("userId")
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await get(`${endPoints.getAllBooks}?createdByUserId=${createdByUserId}`);
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

    const handleEdit = (book) => {
        setEditingBook({ ...book }); // Open modal with data
    };

    const handleUpdate = async () => {
        try {
            const response = await patch(`${endPoints.updateBook}/${editingBook.id}`, editingBook);
            if (response?.status) {
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === editingBook.id ? editingBook : book
                    )
                );
                setEditingBook(null); // close modal
                alert("update book successfully")
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
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Loading books...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            ) : books.length === 0 ? (
                <div className="text-center text-muted my-5">
                    <i className="bi bi-journal-x fs-1"></i>
                    <p className="mt-2">No books available.</p>
                </div>
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
                                        onClick={() => handleEdit(book)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Edit Modal */}
            {editingBook && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
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
                                <div className="mb-2">
                                    <label>Book Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingBook.name}
                                        onChange={(e) =>
                                            setEditingBook({ ...editingBook, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingBook.description}
                                        onChange={(e) =>
                                            setEditingBook({
                                                ...editingBook,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Usage Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingBook.usage_type}
                                        onChange={(e) =>
                                            setEditingBook({
                                                ...editingBook,
                                                usage_type: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Usage Mode</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingBook.usage_mode}
                                        onChange={(e) =>
                                            setEditingBook({
                                                ...editingBook,
                                                usage_mode: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingBook.account_unit}
                                        onChange={(e) =>
                                            setEditingBook({
                                                ...editingBook,
                                                account_unit: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Time Zone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingBook.time_zone}
                                        onChange={(e) =>
                                            setEditingBook({
                                                ...editingBook,
                                                time_zone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
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
            )}
        </div>
    );
};

export default BookList;
