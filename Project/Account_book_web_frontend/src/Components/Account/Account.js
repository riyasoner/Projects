import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import AccountForm from "./AccountEditForm";
import { encryptId } from "../../utils/encryption";
function Account() {
  const { get, del, post, patch } = useApi();
  const [accounts, setAccounts] = useState([]);
  const [editAccount, setEditAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchAccounts = async () => {
    try {
      const bookId = localStorage.getItem("bookId");
      const userId = localStorage.getItem("userId");

      let url = `${endPoints.getAllAccounts}?bookId=${bookId}`;

      if (searchTerm.trim() !== "") {
        url += `&search=${searchTerm}`;
      }

      const response = await get(url);
      if (response?.data) {
        setAccounts(response.data);
      } else {
        console.warn("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error.message || error);
    }
  };
  const fetchSuggestions = async (value) => {
    try {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      const bookId = localStorage.getItem("bookId");
      const userId = localStorage.getItem("userId");

      const url = `${endPoints.accountSuggestions}?bookId=${bookId}&userId=${userId}&search=${value}`;
      const response = await get(url);

      if (response?.status && response.data) {
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.message || error);
    }
  };

  const archiveAccount = async (accountId) => {
    try {
      const url = `${endPoints.archiveAccount}/${accountId}`;
      const response = await post(url, {});

      if (response?.status) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((group) => ({
            ...group,
            accounts: group.accounts.filter((acc) => acc.id !== accountId),
          }))
        );
      } else {
        console.warn("Failed to archive account.");
      }
    } catch (error) {
      console.error("Error archiving account:", error.message || error);
    }
  };

  const deleteAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (!confirmDelete) return;

    try {
      const bookId = localStorage.getItem("bookId");
      const url = `${endPoints.deleteAccount}/${accountId}`;
      const response = await del(url);

      if (response?.status) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((group) => ({
            ...group,
            accounts: group.accounts.filter((acc) => acc.id !== accountId),
          }))
        );
      } else {
        console.warn("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error.message || error);
    }
  };

  useEffect(() => {
    fetchAccounts();

    const handleBookChange = () => {
      fetchAccounts(); // Re-fetch accounts when book selection changes
    };

    window.addEventListener("selectedBookUpdated", handleBookChange);

    return () => {
      window.removeEventListener("selectedBookUpdated", handleBookChange);
    };
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Accounts</h4>
      <div className="mb-3 position-relative">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name & type"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchSuggestions(e.target.value); // suggestions call
          }}
        />

        {suggestions.length > 0 && (
          <ul
            className="list-group position-absolute shadow"
            style={{
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
              width: "300px", // width कम किया
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSearchTerm(s.name);
                  setSuggestions([]);
                  fetchAccounts();
                }}
              >
                <span>{s.name}</span>
                <small className="text-muted">({s.account_type})</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="d-flex justify-content-end mb-3">
        <Link
          to="/new-account"
          className="btn text-white"
          style={{ background: "#019ED3" }}
        >
          <i className="bi bi-plus-circle me-2"></i> Add New Account
        </Link>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th scope="col">Account Type</th>
            <th scope="col">Account Name</th>
            <th scope="col">Description</th>
            <th scope="col">Balance</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((accountGroup) =>
              accountGroup.accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_type}</td>
                  <td>
                    <Link
                      to={`/account/${encryptId(account.id)}`}
                      state={{ account }}
                    >
                      {account.name}
                    </Link>
                  </td>
                  <td>{account.description}</td>
                  <td
                    className={
                      account.balance < 0 ? "text-danger" : "text-success"
                    }
                  >
                    {account.balance} ₹
                  </td>
                  <td>
                    {/* <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => archiveAccount(account.id)}
                      title="Archive Account"
                    >
                      <i className="bi bi-archive"></i>
                    </button> */}
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => setEditAccount(account)}
                      title="Edit Account"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteAccount(account.id)}
                      title="Delete Account"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {editAccount && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <button
                className="btn btn-sm btn-close ms-auto"
                onClick={() => setEditAccount(null)}
              ></button>
              <AccountForm
                account={editAccount}
                onSuccess={() => {
                  setEditAccount(null);
                  fetchAccounts(); // reload
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
