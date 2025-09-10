import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import AccountForm from "../Account/AccountEditForm";
import { encryptId } from "../../utils/encryption";
function CollectionAccount() {
  const { get, del, post, patch } = useApi();
  const [accounts, setAccounts] = useState([]);
  const [editAccount, setEditAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      const bookId = localStorage.getItem("bookId");
      const userId = localStorage.getItem("userId");

      const url = bookId
        ? `${endPoints.getAllAccounts}?bookId=${bookId}`
        : endPoints.getAllAccounts;
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
  }, []);

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Select Account</h4>

      {/* <div className="d-flex justify-content-end mb-3">
        <Link to="/new-account" className="btn text-white" style={{ background: "#019ED3" }}>
          <i className="bi bi-plus-circle me-2"></i> Add New Account
        </Link>
      </div> */}

      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th scope="col">Account Type</th>
            <th scope="col">Account Name</th>
            <th scope="col">Description</th>
            <th scope="col">Balance</th>
            {/* <th scope="col">Actions</th> */}
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
                      to={`/collection/${encryptId(account.id)}`}
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
                  {/* <td>
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => archiveAccount(account.id)}
                      title="Archive Account"
                    >
                      <i className="bi bi-archive"></i>
                    </button>
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
                  </td> */}
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

export default CollectionAccount;
