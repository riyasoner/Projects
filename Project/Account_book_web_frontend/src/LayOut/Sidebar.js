import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);
  const userType = localStorage.getItem("userType");

  const LogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("userType");
    navigate("/"); // Redirect to login/home after logout
  };

  const getItemStyle = (path) => ({
    backgroundColor:
      location.pathname === path
        ? "#E7FFDD"
        : hoveredLink === path
        ? "#F8F9FA"
        : "transparent",
    borderLeft: location.pathname === path ? "4px solid green" : "none",
    paddingLeft: location.pathname === path ? "1.5rem" : "1rem",
    width: "100%",
    display: "block",
    transition: "all 0.3s",
  });

  return (
    <div
      className={`d-flex flex-column bg-light ${
        isOpen ? "p-3" : "p-1"
      } sidebar shadow`}
      style={{
        width: isOpen ? "190px" : "70px",
        height: "100vh",
        position: "fixed",
        transition: "width 0.3s",
        marginTop: "45px",
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <ul className="nav flex-column">
        {/* Tabs - keep your original order and logic */}
        {/* Repeat pattern used below for every tab */}
        <li
          className="nav-item"
          onMouseEnter={() => setHoveredLink("/bussiness")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <Link
            to="/bussiness"
            className="nav-link text-dark d-flex align-items-center"
            style={getItemStyle("/bussiness")}
          >
            <i className="bi bi-book"></i>
            {isOpen && <span className="ms-3 mt-2">My Business</span>}
          </Link>
        </li>

        {!(userType === "admin" || userType === "user") && (
          <>
            <li
              className="nav-item"
              onMouseEnter={() => setHoveredLink("/booksList")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link
                to="/booksList"
                className="nav-link text-dark d-flex align-items-center"
                style={getItemStyle("/booksList")}
              >
                <i className="bi bi-journal-bookmark"></i>
                {isOpen && <span className="ms-3">Books</span>}
              </Link>
            </li>
            <li
              className="nav-item"
              onMouseEnter={() => setHoveredLink("/assignBook")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link
                to="/assignBook"
                className="nav-link text-dark d-flex align-items-center"
                style={getItemStyle("/assignBook")}
              >
                <i className="bi bi-journal-bookmark"></i>
                {isOpen && <span className="ms-3">Assign Admin</span>}
              </Link>
            </li>
            <li
              className="nav-item"
              onMouseEnter={() => setHoveredLink("/viewAssignBook")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link
                to="/viewAssignBook"
                className="nav-link text-dark d-flex align-items-center"
                style={getItemStyle("/viewAssignBook")}
              >
                <i className="bi bi-book"></i>
                {isOpen && <span className="ms-3">View Admin Book</span>}
              </Link>
            </li>
          </>
        )}

        {/* Keep rest tabs same as you wrote */}
        {[
          { path: "/accounts", icon: "bi-journal-text", label: "Accounts" },
          { path: "/transactions", icon: "bi-calendar", label: "Transactions" },
          {
            path: "/upcoming-transactions",
            icon: "bi-clock-history",
            label: "Upcoming Transactions",
          },
          {
            path: "/collection",
            icon: "bi-clock-history",
            label: "Collection",
          },
          {
            path: "/viewSettlementRequest",
            icon: "bi-book",
            label: "View Settlement Request",
          },
          { path: "/notes", icon: "bi-pencil-square", label: "Notes" },
          { path: "/reports", icon: "bi-bar-chart", label: "Reports" },
          { path: "/categories", icon: "bi-tags", label: "Categories" },
          // { path: "/archive", icon: "bi-folder", label: "Archive" },
          { path: "/archive", icon: "bi-trash3", label: "Account Bin" },
          {
            path: "/registerUser",
            icon: "bi-pencil-square",
            label: "Register User",
          },
        ].map((item) => (
          <li
            key={item.path}
            className="nav-item"
            onMouseEnter={() => setHoveredLink(item.path)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Link
              to={item.path}
              className="nav-link text-dark d-flex align-items-center"
              style={getItemStyle(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              {isOpen && <span className="ms-3">{item.label}</span>}
            </Link>
          </li>
        ))}

        <hr />

        {[
          { path: "/notifications", icon: "bi-bell", label: "Notifications" },
          { path: "/settings", icon: "bi-gear", label: "Settings" },
          { path: "/help", icon: "bi-question-circle", label: "Help" },
        ].map((item) => (
          <li
            key={item.path}
            className="nav-item"
            onMouseEnter={() => setHoveredLink(item.path)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Link
              to={item.path}
              className="nav-link text-dark d-flex align-items-center"
              style={getItemStyle(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              {isOpen && <span className="ms-3">{item.label}</span>}
            </Link>
          </li>
        ))}

        {/* ✅ Logout at bottom */}
        <li
          className="nav-item"
          onMouseEnter={() => setHoveredLink("/")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <Link
            to="/"
            className="nav-link text-dark d-flex align-items-center mb-5"
            style={getItemStyle("/")}
            onClick={LogOut}
          >
            <i className="bi bi-box-arrow-right"></i>
            {isOpen && <span className="ms-3">Logout</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
