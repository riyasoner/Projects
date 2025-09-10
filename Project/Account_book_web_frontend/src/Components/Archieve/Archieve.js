import React, { useState, useEffect } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const Archive = () => {
  const { get, patch, del } = useApi();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");
      const bookId = localStorage.getItem("bookId");

      let url = `${endPoints.getArchiveAccount}?is_deleted=true&bookId=${bookId}`;
      if (userType === "admin" || userType === "user") {
        url += `&userId=${userId}`;
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

  const handleRestore = async (accountId) => {
    const confirm = window.confirm(
      "Are you sure you want to restore this account?"
    );
    if (!confirm) return;

    try {
      const response = await patch(endPoints.restoreAccount, { accountId });

      if (response?.status) {
        alert("Account restored successfully.");
        setSelectedAccount(null);
        fetchAccounts();
      } else {
        alert("Failed to restore account.");
      }
    } catch (error) {
      console.error("Restore failed:", error.message || error);
    }
  };

  const handlePermanentDelete = async (accountId) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this account?"
    );
    if (!confirm) return;

    try {
      const response = await del(
        `${endPoints.deleteAccountPermanently}/${accountId}`
      );

      if (response?.status) {
        alert("Account permanently deleted.");
        if (selectedAccount?.id === accountId) setSelectedAccount(null);
        fetchAccounts();
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Permanent delete failed:", error.message || error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          position: "fixed",
          top: "67px",
          height: "100vh",
          width: "280px",
          borderRight: "1px solid #ccc",
          backgroundColor: "#f8f9fa",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#419EB9",
            color: "white",
            padding: "12px",
            position: "sticky",
            top: 0,
            zIndex: 1001,
          }}
        >
          <h5 className="mb-0">
            <i className="fas fa-trash-alt me-2"></i> Account Bin
          </h5>
          <small>Deleted accounts are listed here</small>
        </div>
        <ul className="list-group list-group-flush">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <li
                key={account.id}
                className={`list-group-item ${
                  selectedAccount?.id === account.id ? "text-dark fw-bold" : ""
                }`}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedAccount?.id === account.id
                      ? "#E7FFDD"
                      : "transparent",
                }}
                onClick={() => setSelectedAccount(account)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{account.name}</strong>
                    <br />
                    <small>{account.description}</small>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item">No archived accounts found.</li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="content p-4"
        style={{
          marginLeft: "280px",
          width: "100%",
        }}
      >
        {selectedAccount ? (
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">📝 Account Details</h5>

            <p>
              <strong>Name:</strong> {selectedAccount.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedAccount.description}
            </p>
            <p>
              <strong>Type:</strong> {selectedAccount.account_type}
            </p>
            <p>
              <strong>Balance:</strong> ₹{selectedAccount.balance}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedAccount.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(selectedAccount.updatedAt).toLocaleString()}
            </p>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-success"
                onClick={() => handleRestore(selectedAccount.id)}
              >
                <i className="fas fa-undo me-2"></i> Restore Account
              </button>

              <button
                className="btn btn-outline-danger"
                onClick={() => handlePermanentDelete(selectedAccount.id)}
                title="Permanently delete this account"
              >
                <i className="fas fa-trash me-2"></i> Delete Permanently
              </button>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            Select an account to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
