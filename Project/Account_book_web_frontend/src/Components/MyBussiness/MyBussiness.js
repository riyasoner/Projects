import React, { useEffect, useState } from "react";
import { FaBook, FaCog, FaShareAlt } from "react-icons/fa";
import AddBookForm from "./AddBook";
import EditBookForm from "./BookEdit";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import Transactions from "../Transaction/Transaction";

const MyBusiness = () => {
  const { get } = useApi();
  const [books, setBooks] = useState([]);
  const [sharedBooks, setSharedBooks] = useState([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editBook, setEditBook] = useState(false);
  const [activeContent, setActiveContent] = useState("transactions");

  const [selectedBook, setSelectedBook] = useState(() => {
    const name = localStorage.getItem("selectedBook") || "My Books";
    const id = localStorage.getItem("bookId") || null;
    return { id, name };
  });

  const toggleBookForm = () => {
    setShowBookForm(!showBookForm);
    setEditBook(false);
  };

  const toggleEditForm = () => {
    setEditBook(!editBook);
    setShowBookForm(false);
  };

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  // Fetch assigned books for the user
  const fetchBooks = async () => {
    try {
      let url = endPoints.getAssignedBook;
      if (userType === "admin" || userType === "user") {
        url += `?userId=${userId}`;
      } else {
        url = `${endPoints.getAllBooks}?createdByUserId=${userId}`;
      }

      const response = await get(url);
      if (response?.data?.length > 0) {
        setBooks(response.data);
        let bookId = localStorage.getItem("bookId");

        // if (!bookId || isNaN(bookId)) {

        //     bookId = response.data[0].id; // Default to the first book

        //     localStorage.setItem("bookId", bookId);
        // }
        // bookId = parseInt(bookId, 10); // Ensure it's a number
        // const currentBook = response.data.find(book => book.id == bookId);
        // if (currentBook) {
        //     setSelectedBook(currentBook.name);
        // } else {
        //     setSelectedBook("Unknown Book");
        // }
      } else {
        console.warn("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching books:", error.message || error);
    }
  };

  // Fetch all assigned books and filter those with multiple users
  const fetchSharedBooks = async () => {
    try {
      const response = await get(endPoints.getAllAssignBook);
      if (response?.data?.length > 0) {
        // Filter books that have more than one user assigned
        const filteredBooks = response.data.filter(
          (book) => book.users.length > 1
        );
        setSharedBooks(filteredBooks);
      } else {
        console.warn("No shared books found.");
      }
    } catch (error) {
      console.error("Error fetching shared books:", error.message || error);
    }
  };

  const handleBookClick = (book) => {
    const selected = { id: book.id, name: book.name };
    setSelectedBook(selected);
    localStorage.setItem("bookId", book.id);
    localStorage.setItem("selectedBook", book.name);
    window.dispatchEvent(new Event("selectedBookUpdated"));
    setActiveContent("transactions");
  };

  useEffect(() => {
    const updateSelectedBook = () => {
      const name = localStorage.getItem("selectedBook") || "My Books";
      const id = localStorage.getItem("bookId") || null;
      setSelectedBook({ id, name });
    };

    // Initial fetch
    fetchBooks();
    if (userType !== "admin" && userType !== "user") {
      fetchSharedBooks();
    }

    // Listen for changes from Header
    window.addEventListener("selectedBookUpdated", updateSelectedBook);

    // Cleanup
    return () => {
      window.removeEventListener("selectedBookUpdated", updateSelectedBook);
    };
  }, []);

  return (
    <div className="d-flex">
      <div
        className="sidebar bg-light p-3"
        style={{
          height: "100vh",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <div
          className="mb-4"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#E5EAEC",
            color: "#0F6D61",
            padding: "2px",
          }}
        >
          <h5 className="text-uppercase d-flex align-items-center">
            <FaBook className="me-2" /> My Books
          </h5>
        </div>

        {/* Note section for user guidance */}
        <div className="alert alert-info p-2 text-dark">
          <small>
            <strong>Note:</strong> Select a book to view related details.
          </small>
        </div>

        <div
          className="mb-4 d-flex justify-content-between align-items-center"
          style={{ position: "sticky", top: 0, zIndex: 1000, color: "#0F6D61" }}
        >
          <h5 className="text-uppercase d-flex align-items-center">
            {selectedBook.name}
          </h5>
          {/* <FaCog
                        className="text-muted"
                        style={{ cursor: "pointer" }}
                        onClick={toggleEditForm}
                    /> */}
        </div>
        <hr />

        <ul className="list-unstyled mt-3 text-end">
          {books.length > 0 ? (
            books.map((book, index) => (
              <li
                key={index}
                className="mb-2 book-item"
                style={{ cursor: "pointer" }}
                onClick={() => handleBookClick(book)}
              >
                <strong>{book?.name?.toUpperCase() || "NO NAME"}</strong>
              </li>
            ))
          ) : (
            <p>No books available</p>
          )}
          <hr />
          {!(userType === "admin" || userType === "user") && (
            <li className="mb-3">
              <button onClick={toggleBookForm} className="btn btn-success">
                NEW BOOK +
              </button>
            </li>
          )}
        </ul>

        {/* Shared Books Section - Only visible if userType is NOT admin or user */}
        {userType !== "admin" && userType !== "user" && (
          <>
            <div
              style={{
                backgroundColor: "#E5EAEC",
                color: "#0F6D61",
                padding: "8px",
                marginTop: "15px",
              }}
            >
              <h5 className="text-uppercase d-flex align-items-center">
                <FaShareAlt className="me-2" /> Shared Books
              </h5>
            </div>

            {sharedBooks.length > 0 ? (
              <ul className="list-unstyled mt-3">
                {sharedBooks.map((book, index) => (
                  <li key={index} className="mb-2">
                    <strong>Book Name: {book.bookName}</strong> <br />
                    <small>
                      Shared with Users:
                      {book.users
                        .map((user) => user.name)
                        .map((name, idx) => (
                          <>
                            {idx > 0 && idx % 3 === 0 ? <br /> : " "}
                            {name}
                            {idx !== book.users.length - 1 ? "," : ""}
                          </>
                        ))}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mt-3">No shared books available.</p>
            )}
          </>
        )}
      </div>

      <div className="content p-3" style={{ flex: 1, paddingTop: "20px" }}>
        {showBookForm && !editBook ? (
          <AddBookForm onClose={toggleBookForm} fetchBooks={fetchBooks} />
        ) : editBook ? (
          <EditBookForm onClose={toggleEditForm} />
        ) : (
          <div>
            {/* Content goes here */}
            <Transactions
              key={selectedBook.id} // This will trigger re-render when book changes
              selectedBook={selectedBook}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBusiness;
