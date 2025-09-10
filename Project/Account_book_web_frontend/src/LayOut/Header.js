import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import useApi from "../../src/hooks/useApi";
import endPoints from "../../src/api/endPoints";
import { FaBook } from "react-icons/fa";

function Header({ isOpen, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false);
  const [name, setName] = useState("My Books");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { get } = useApi();
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const dropdownRef = useRef();
  const bookDropdownRef = useRef();

  // Load selected book name from localStorage
  useEffect(() => {
    const updateBookName = () => {
      const storedName = localStorage.getItem("selectedBook");
      setName(storedName || "My Books");
    };

    updateBookName();
    window.addEventListener("selectedBookUpdated", updateBookName);

    return () => {
      window.removeEventListener("selectedBookUpdated", updateBookName);
    };
  }, []);

  // Fetch books
  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Error fetching books:", error.message || error);
      }
    };

    fetchBooks();
  }, [get, userId, userType]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        bookDropdownRef.current &&
        !bookDropdownRef.current.contains(e.target)
      ) {
        setBookDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookSelect = (book) => {
    localStorage.setItem("bookId", book.id);
    localStorage.setItem("selectedBook", book.name);
    setName(book.name);
    setBookDropdownOpen(false);
    window.dispatchEvent(new Event("selectedBookUpdated"));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="d-flex align-items-center">
          <button
            className="btn"
            onClick={toggleSidebar}
            style={{ outline: "none", border: "none" }}
          >
            <i className="bi bi-list fs-3"></i>
          </button>
          {isOpen && (
            <img
              src="/pix-account-logo/Account-book-with-name.png"
              alt="Account Book Logo"
              style={{ height: "40px", width: "auto", marginLeft: "0.5rem" }}
            />
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center flex-grow-1 px-3">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item position-relative" ref={bookDropdownRef}>
              <div className="d-flex align-items-center">
                <button
                  className="btn nav-link d-flex align-items-center gap-2"
                  onClick={() => {
                    setBookDropdownOpen(!bookDropdownOpen);
                    setDropdownOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    padding: 0,
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  <FaBook className="text-primary" />
                  <span>{name?.toUpperCase()}</span>
                </button>
              </div>

              {bookDropdownOpen && (
                <ul
                  className="dropdown-menu show"
                  style={{ right: 0, zIndex: 1050 }}
                >
                  {books.map((book) => (
                    <li key={book.id}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleBookSelect(book)}
                      >
                        {book.name.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Settings Dropdown */}
            <li className="nav-item position-relative ms-3" ref={dropdownRef}>
              <button
                className="btn nav-link"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setBookDropdownOpen(false);
                }}
              >
                <i className="bi bi-person-circle fs-5"></i>
              </button>

              {dropdownOpen && (
                <ul
                  className="dropdown-menu show"
                  style={{ right: 0, zIndex: 1050 }}
                >
                  <li>
                    <Link to="/settings" className="dropdown-item">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>

          {/* Right Side Buttons */}
          <div className="d-flex ms-3">
            <Link to="/new-transaction">
              <button
                className="btn text-dark me-2"
                style={{ backgroundColor: "#B7FFA6", border: "none" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#13977D";
                  e.target.style.color = "#293439";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#B7FFA6";
                  e.target.style.color = "#000";
                }}
              >
                <i className="bi bi-plus-circle me-2"></i> New Transaction
              </button>
            </Link>

            <Link to="/new-account">
              <button
                className="btn text-dark"
                style={{ backgroundColor: "#B7FFA6", border: "none" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#13977D";
                  e.target.style.color = "#293439";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#B7FFA6";
                  e.target.style.color = "#000";
                }}
              >
                <i className="bi bi-file-earmark me-2"></i> New Account
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
