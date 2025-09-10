import React, { useEffect, useState } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const AssignedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get, del } = useApi();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await get(endPoints.getAllAssignBook);
      if (response?.data) {
        setBooks(response.data);
      } else {
        setError("No data received from server.");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Something went wrong while fetching books.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId, userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assigned book?"
    );
    if (!confirmDelete) return;

    try {
      await del(
        `${endPoints.removeAssignedBook}?bookId=${bookId}&userId=${userId}`
      );

      setBooks((prevBooks) =>
        prevBooks
          .map((book) => {
            if (book.bookId === bookId) {
              return {
                ...book,
                users: book.users.filter((user) => user.id !== userId),
              };
            }
            return book;
          })
          .filter((book) => book.users.length > 0)
      );
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete assigned book. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-3 fw-normal">Assigned Books</h4>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100px" }}
        >
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Book Name</th>
              <th>Assigned To</th>
              <th>User Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No assigned books found.
                </td>
              </tr>
            ) : (
              books.map((book, index) =>
                book.users.map((user, userIndex) => (
                  <tr key={`${book.bookId}-${user.id}`}>
                    <td>{index + 1}</td>
                    <td>{book.bookName}</td>
                    <td>{user.name}</td>
                    <td>{user.user_type}</td>
                    <td>{user.email_id}</td>
                    <td>{user.phone_no}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(book.bookId, user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedBooks;
