import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import EditTransactionForm from "./EditTransaction";

function Transactions({ selectedBook }) {
  const { get, post, del } = useApi();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null); //  for scroll handling

  const bookId = localStorage.getItem("bookId");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setShowVerifyButton(userType !== "admin" && userType !== "user");
    setTransactions([]);
    setPage(1);
    setHasMore(true);
  }, [selectedBook]);

  useEffect(() => {
    fetchTransactions(searchTerm);
  }, [page]);

  const fetchTransactions = useCallback(
    async (category = "", pageNumber = page) => {
      // If loading and pageNumber > 1, block further scroll loads
      if (loading && pageNumber > 1) return;

      setLoading(true);

      try {
        const currentBookId = localStorage.getItem("bookId");
        const params = { category, page: pageNumber, bookId: currentBookId };
        const response = await get(endPoints.getAllTransactions, { params });

        if (response?.data) {
          setTransactions((prev) =>
            pageNumber === 1 ? response.data : [...prev, ...response.data]
          );
          setHasMore(response.page < response.totalPages);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [get, page] // only depend on `get` and `page`
  );
  const handleTransactionUpdated = () => {
    setTransactions([]);
    setHasMore(true);
    setPage(1);
    setEditTransaction(false);
    fetchTransactions(searchTerm, 1); // force fetch first page
  };
  useEffect(() => {
    fetchTransactions(searchTerm, page);
  }, [page, searchTerm, fetchTransactions]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPage(1);
    setHasMore(true);
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setTransactions([]); // reset on new search
      fetchTransactions(searchTerm, 1);
    }, 500); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isBottom = scrollHeight - scrollTop <= clientHeight + 5;

    if (isBottom && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(searchTerm, nextPage);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleVerify = async (transaction) => {
    try {
      const response = await post(endPoints.viewTransactionBySupAdmin, {
        accountId: transaction.accountId,
        bookId,
        transaction_id: transaction.transaction_id,
      });

      if (response.status) {
        alert(response.message || "Transaction verified successfully!");
        setTransactions((prev) =>
          prev.map((t) =>
            t.transaction_id === transaction.transaction_id
              ? { ...t, verified: true, view_by_superAdmin: true }
              : t
          )
        );
      } else {
        alert("Failed to verify transaction.");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      const response = await del(
        `${endPoints.deleteTransactionById}/${transactionId}`
      );
      if (response.status) {
        alert("Transaction deleted successfully!");
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      } else {
        alert("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const getTransactionFlow = (type) => {
    const credit = ["INCOME", "COLLECTION", "ADD"];
    const debit = ["EXPENSE", "PAYMENT", "SUBTRACT"];
    return credit.includes(type)
      ? "credit"
      : debit.includes(type)
      ? "debit"
      : "transfer";
  };

  const getTypeColor = (type) => {
    const colors = {
      INCOME: "blue",
      SALE: "#0d6efd",
      INVENTORY_SALE: "#0d6efd",
      COLLECTION: "purple",
      BORROW: "#6f42c1",
      ADD: "chocolate",
      EXPENSE: "red",
      PURCHASE: "orange",
      INVENTORY_PURCHASE: "orange",
      PERSONNEL_EXPENSE: "crimson",
      PAYMENT: "green",
      LEND: "brown",
      SUBTRACT: "chocolate",
      TRANSFER: "orange",
    };
    return colors[type] || "#6c757d";
  };
  useEffect(() => {
    const handleBookChange = () => {
      setSearchTerm(""); // reset search

      setTransactions([]);
      setPage(1);
      setHasMore(true);
      fetchTransactions(searchTerm, 1);
    };

    window.addEventListener("selectedBookUpdated", handleBookChange);

    return () => {
      window.removeEventListener("selectedBookUpdated", handleBookChange);
    };
  }, [fetchTransactions, searchTerm]);

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Transactions</h4>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by category"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="d-flex justify-content-end mb-3">
        <Link
          to="/accounts"
          className="btn text-white"
          style={{ background: "#019ED3" }}
        >
          <i className="bi bi-plus-circle me-2"></i> Add New Transaction
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div
          className="table-responsive mt-3"
          ref={scrollRef}
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            border: "1px solid #ccc",
          }}
        >
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>From → To</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Category</th>
                <th>Description</th>
                <th>Target Account</th>
                <th>Amount</th>
                <th>Account Holder </th>
                <th className="text-center">Viewed</th>
                {showVerifyButton && <th className="text-center">Verify</th>}
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...transactions]
                .sort(
                  (a, b) =>
                    new Date(b.transaction_date) - new Date(a.transaction_date)
                )
                .map((transaction, index) => {
                  const flow = getTransactionFlow(transaction.transaction_type);
                  const from = transaction.account?.name || "Account";
                  const to = transaction.to_account_details?.name || "Target";
                  const typeColor = getTypeColor(transaction.transaction_type);
                  const time =
                    transaction.transaction_time || transaction.createdAt || "";

                  const formattedTime = time
                    ? new Date(`1970-01-01T${time}`).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )
                    : "";

                  return (
                    <tr
                      key={index}
                      style={{
                        opacity: transaction.account_settled ? 0.5 : 1,
                        backgroundColor: transaction.account_settled
                          ? "#ffcccc"
                          : "transparent",
                        transition: "all 0.3s",
                      }}
                    >
                      <td>
                        <strong className="text-danger">{from}</strong>
                        <i className="bi bi-arrow-right mx-1 text-muted"></i>
                        <strong className="text-success">{to}</strong>
                      </td>
                      <td style={{ color: typeColor, fontWeight: "bold" }}>
                        {transaction.transaction_type.replace(/_/g, " ")}
                      </td>
                      <td>
                        {transaction.transaction_date
                          ? `${new Date(
                              transaction.transaction_date
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })} ${formattedTime}`
                          : "N/A"}
                      </td>
                      <td>{transaction.category || "—"}</td>
                      <td>{transaction.description || "—"}</td>
                      <td>{to}</td>
                      <td style={{ color: typeColor }}>{transaction.amount}</td>
                      <td>{transaction.user?.name || "—"}</td>
                      <td className="text-center">
                        <i
                          className="bi bi-eye-fill"
                          style={{
                            color: transaction.view_by_superAdmin
                              ? "green"
                              : "black",
                            fontSize: "1.4rem",
                          }}
                        ></i>
                      </td>
                      {showVerifyButton && (
                        <td className="text-center">
                          <i
                            className="bi bi-check-circle"
                            style={{
                              color: "black",
                              fontSize: "1.4rem",
                              cursor: "pointer",
                            }}
                            onClick={() => handleVerify(transaction)}
                          ></i>
                        </td>
                      )}
                      <td className="text-center">
                        <i
                          className="bi bi-pencil-square me-2"
                          style={{
                            color: "#0d6efd",
                            fontSize: "1.4rem",
                            cursor: "pointer",
                          }}
                          onClick={() => setEditTransaction(transaction)}
                        ></i>
                        <i
                          className="bi bi-trash"
                          style={{
                            color: "red",
                            fontSize: "1.4rem",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDelete(transaction.id)}
                        ></i>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {loading && (
            <div className="text-center py-2">
              <span className="spinner-border spinner-border-sm text-primary"></span>
            </div>
          )}
        </div>
      ) : (
        <div
          className="table-responsive mt-3"
          style={{ border: "1px solid #ccc" }}
        >
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-primary">
              <tr>
                <th>From → To</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Category</th>
                <th>Description</th>
                <th>Target Account</th>
                <th>Amount</th>
                <th>Account Holder </th>
                <th className="text-center">Viewed</th>
                {showVerifyButton && <th className="text-center">Verify</th>}
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="no-data-row">
                <td
                  colSpan={showVerifyButton ? 12 : 11}
                  className="text-center p-2"
                >
                  No transactions found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {editTransaction && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <EditTransactionForm
              transaction={editTransaction}
              onClose={() => setEditTransaction(false)}
              // onSave={() => {
              //   setTransactions([]); // Clear current list
              //   setPage(1); // Reset pagination
              //   setHasMore(true); // Reset end flag
              //   fetchTransactions(searchTerm, 1); // Reload first page
              //   setEditTransaction(false); // Close modal
              // }}
              onSave={() => handleTransactionUpdated()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
