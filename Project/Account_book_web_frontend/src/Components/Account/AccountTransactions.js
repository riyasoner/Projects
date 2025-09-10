import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddTransaction from "./AddTransaction";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import TransactionPDF from "./TransactionPdf";
import { pdf } from "@react-pdf/renderer";
import SettledTransactionForm from "../MyBussiness/SettledTransaction";
import { useSidebar } from "../../context/SidebarContext";
import { decryptId } from "../../utils/encryption";
function AccountTransactions() {
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();

  const encryptedId = location.pathname.split("/").pop();
  const accountId = decryptId(encryptedId); // decrypted original ID
  const [transactions, setTransactions] = useState([]);
  const { account } = location.state || {};
  const [selectedId, setSelectedId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const { del, patch, get } = useApi();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showSettleComponent, setShowSettleComponent] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [accountBalance, setAccountBalance] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const fetchTransactions = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const [resTransactions, resAccountInfo, categoriesres] =
        await Promise.all([
          get(`${endPoints.getAllTransactions}?accountId=${accountId}`),
          get(`${endPoints.getAccountBalance}/${accountId}`),
          get(`${endPoints.getCategories}?userId=${userId}`),
        ]);

      if (categoriesres?.data) setCategories(categoriesres.data);
      if (resTransactions?.data) setTransactions(resTransactions.data);
      if (resAccountInfo?.data) setAccountBalance(resAccountInfo.data.balance);
    } catch (error) {
      console.error("Failed to fetch transactions or account info:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [accountId, account]);

  const handleEditClick = (txn) => setEditForm({ ...txn });

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await patch(
        `${endPoints.updateTransaction}/${editForm.id}`,
        editForm
      );
      if (!res.status) return alert("Failed to update transaction.");
      alert("Transaction updated successfully!");
      setEditForm(null);
      setSelectedId(null);
      fetchTransactions();
    } catch (err) {
      console.error("Update error:", err.message);
      alert("An error occurred while updating the transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      const res = await del(`${endPoints.deleteTransactionById}/${id}`);
      if (!res.status) return alert("Failed to delete transaction.");
      alert("Transaction deleted successfully!");
      setSelectedId(null);
      fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Failed to delete transaction.");
    }
  };

  const handleDownload = async () => {
    try {
      const query = `?accountId=${accountId}&startDate=${fromDate}&endDate=${toDate}`;
      const res = await get(
        `${endPoints.get_all_transactions_for_download}${query}`
      );
      if (!res?.data?.length)
        return console.warn("No transactions for the selected range.");

      const blob = await pdf(
        <TransactionPDF
          transactions={res.data}
          fromDate={fromDate}
          toDate={toDate}
        />
      ).toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Transactions_${fromDate}_to_${toDate}.pdf`;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const getTxnColor = (txn, accountId) => {
    const isOut =
      ["EXPENSE", "SUBTRACT"].includes(txn.transaction_type) ||
      (["PAYMENT", "COLLECTION", "TRANSFER"].includes(txn.transaction_type) &&
        txn.accountId == accountId);

    return isOut ? "red" : "blue";
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div
      className="container-fluid"
      style={{
        paddingTop: "50px",
        paddingBottom: "130px",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Fixed Top Header */}
      <div
        className="d-flex justify-content-between align-items-center text-white p-2 position-fixed top-0  shadow"
        style={{
          background: "#419EB9",
          zIndex: 1050,
          marginTop: "70px",
          width: isSidebarOpen ? "195vh" : "213vh",
        }}
      >
        <span>Transactions for {account?.name}</span>
        <div className="d-flex gap-2 align-items-center me-4">
          <i
            className="bi bi-check-circle-fill btn btn-light rounded-circle d-flex justify-content-center align-items-center"
            style={{
              fontSize: "16px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
            }}
            title="Settle Transaction"
            onClick={() => {
              setSelectedAccountId(account?.id);
              setShowSettleComponent(true);
            }}
          ></i>

          <i
            className="bi bi-upload btn btn-light rounded-circle d-flex justify-content-center align-items-center"
            style={{
              fontSize: "16px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
            }}
            title="Download"
            onClick={() => setShowDownloadModal(true)}
          ></i>

          <i
            className="bi bi-arrow-left btn btn-light rounded-circle d-flex justify-content-center align-items-center"
            style={{
              fontSize: "16px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
            }}
            title="Back"
            onClick={() => handleBack()}
          ></i>
        </div>
      </div>

      {/* Settle Form */}
      {showSettleComponent && (
        <SettledTransactionForm
          accountId={selectedAccountId}
          onClose={() => setShowSettleComponent(false)}
        />
      )}
      <h5 className="fw-bold text-end mb-3 " style={{ fontSize: "15px" }}>
        Balance{" "}
      </h5>

      {/* Table Content */}
      <div className="table-responsive" style={{ paddingBottom: "100px" }}>
        <table className="table table-hover">
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-3">
                  No transactions found.
                  <br />
                  Add a new transaction to get started.
                </td>
              </tr>
            ) : (
              [...transactions]
                .sort(
                  (a, b) =>
                    new Date(b.transaction_date) - new Date(a.transaction_date)
                )
                .map((txn) => (
                  <React.Fragment key={txn.id}>
                    <tr
                      className="border-bottom"
                      style={{
                        cursor: "pointer",
                        opacity: txn.account_settled ? 0.5 : 1,
                        backgroundColor: txn.account_settled
                          ? "#ffcccc"
                          : "transparent",
                      }}
                      onClick={() =>
                        setSelectedId(selectedId === txn.id ? null : txn.id)
                      }
                    >
                      <td style={{ width: "60%" }}>
                        <div
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          {txn.transaction_date?.split("T")[0]}{" "}
                          {txn.transaction_time}
                        </div>
                        <span className="fw-bold" style={{ fontSize: "14px" }}>
                          <span className="text-danger">
                            {txn.account?.name || "Unknown"}
                          </span>
                          <span className="mx-1">→</span>
                          <span className="text-success">
                            {txn.to_account_details?.name || "Unknown"}
                          </span>
                        </span>
                        <br />
                        <span
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          {txn.description || "No Description"}
                        </span>
                        <br />
                        <span
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          {txn.user?.name || "N/A"}
                        </span>
                      </td>
                      <td
                        className="fw-bold text-uppercase"
                        style={{
                          fontSize: "13px",
                          color: getTxnColor(txn, accountId),
                        }}
                      >
                        {txn.transaction_type}
                      </td>
                      <td
                        className="fw-bold text-end"
                        style={{
                          fontSize: "14px",
                          width: "10%",
                          color: getTxnColor(txn, accountId),
                        }}
                      >
                        {(() => {
                          const amt = (txn.amount ?? 0).toFixed(2) + " ₹";
                          const isOut = txn.accountId == accountId;

                          switch (txn.transaction_type) {
                            case "EXPENSE":
                            case "SUBTRACT":
                              return `- ${amt}`;
                            case "INCOME":
                            case "ADD":
                              return `+ ${amt}`;
                            case "PAYMENT":
                              return isOut ? `- ${amt}` : `+ ${amt}`;

                            case "COLLECTION":
                              return isOut ? `- ${amt}` : `+ ${amt}`;

                            case "TRANSFER":
                              return isOut ? `- ${amt}` : `+ ${amt}`;
                            default:
                              return amt;
                          }
                        })()}
                      </td>
                      <td
                        className="fw-bold text-end"
                        style={{
                          fontSize: "14px",
                          width: "10%",
                          color: txn.running_balance < 0 ? "red" : "inherit",
                        }}
                      >
                        {/* <span>
                          {txn.accountId == accountId
                            ? txn.current_source_acc_available_balance
                            : txn.current_targeted_acc_available_balance}{" "}
                          ₹
                        </span> */}
                        <span>{txn.running_balance.toFixed(2)} ₹</span>
                      </td>
                    </tr>

                    {selectedId === txn.id && (
                      <tr>
                        <td colSpan="5">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(txn)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(txn.id)}
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    )}

                    {editForm?.id === txn.id && (
                      <tr className="bg-white">
                        <td colSpan="5">
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                value={editForm.description}
                                onChange={(e) =>
                                  handleInputChange(
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <select
                                className="form-select"
                                value={editForm.category}
                                onChange={(e) =>
                                  handleInputChange("category", e.target.value)
                                }
                              >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                  <option
                                    key={cat.id}
                                    value={cat.category_name}
                                  >
                                    {cat.category_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-2">
                              <input
                                type="number"
                                className="form-control"
                                value={editForm.amount}
                                onChange={(e) =>
                                  handleInputChange(
                                    "amount",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <input
                                type="date"
                                className="form-control"
                                value={
                                  new Date(editForm.transaction_date)
                                    .toISOString()
                                    .split("T")[0]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "transaction_date",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={handleSave}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setEditForm(null);
                                  setSelectedId(null);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed Balance */}
      {/* <div
        className="fw-bold text-end p-2 bg-light position-fixed"
        style={{ bottom: "195px", right: "35px", zIndex: 1000 }}
      >
        <span className={accountBalance < 0 ? "text-danger" : "text-success"}>
          Total Available Balance: ₹{accountBalance}
        </span>
      </div> */}

      {/* Fixed Bottom AddTransaction */}
      <div
        className={`bg-white p-3 shadow-lg position-fixed bottom-0 ${
          isSidebarOpen ? "start-250" : "start-250"
        }`}
        style={{
          zIndex: 1050,
          width: isSidebarOpen ? "85%" : "93%",
        }}
      >
        <AddTransaction
          accountId={accountId}
          account={account}
          onAddTransaction={fetchTransactions}
          accountBalance={accountBalance}
        />
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Date Range</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDownloadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label>From Date:</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <label>To Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDownloadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleDownload}
                  disabled={!fromDate || !toDate}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountTransactions;
