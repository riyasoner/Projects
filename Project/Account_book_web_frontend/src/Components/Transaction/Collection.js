import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import "../UpcomingTransaction/UpcomingTransactions.css";
import { useLocation, useParams } from "react-router-dom";
import EditCollectionModal from "./EditCollection";
import { decryptId } from "../../utils/encryption";
function Collection() {
  const { get, post, del, patch } = useApi();
  const [transactions, setTransactions] = useState([]);
  const [emiMap, setEmiMap] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { account } = location.state || {};
  const { id } = useParams(); // ✅ Gets the `:id` from the URL
  const accountId = decryptId(id); // ✅ decrypted original ID
  const [editCollection, setEditCollection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = async (search = "") => {
    try {
      const params = { search };
      const response = await get(
        `${endPoints.get_all_collection}?accountId=${accountId}`,
        { params }
      );

      if (response?.data) {
        const transactions = response.data || [];
        setTransactions(transactions);

        const map = {};
        transactions.forEach((tx) => {
          map[tx.id] = tx.emi_transactions || [];
        });

        setEmiMap(map);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error.message || error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchTransactions();
    }
  }, [accountId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchTransactions(value);
  };

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleEditAllEmi = async (emi) => {
    try {
      const payload = {
        accountId: [emi.accountId],
        to_account: emi.to_account,
        collection_status: "Completed",
      };

      const response = await post(endPoints.updateCollectionStatus, payload);

      if (response.status) {
        alert("All EMIs marked as Paid!");
        fetchTransactions();
      } else {
        alert(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating EMI status:", error.message || error);
      alert("Something went wrong while updating EMI status.");
    }
  };

  const handleEditOneEmi = async (emi) => {
    try {
      const payload = {
        accountId: emi.accountId,
        to_account: emi.to_account,
        collection_status: "Completed",
        coll_emi_times: emi.coll_emi_times,
        transaction_type: "COLLECTION",
        transaction_id: emi.transaction_id,
      };

      const response = await post(endPoints.updateCollectionStatus, payload);

      if (response.status) {
        alert("EMI Paid Successfully!");
        fetchTransactions();
      } else {
        alert(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error occur in  Paid EMI :", error.message || error);
      alert("Something went wrong while updating EMI status.");
    }
  };
  // ✏️ Edit Collection
  const openEditModal = (collection) => {
    setEditCollection(collection);
    setShowModal(true);
  };
  const closeEditModal = () => setShowModal(false);

  // ❌ Delete Collection
  const handleDeleteCollection = async (collectionId) => {
    // Step 1: First confirmation with detailed warning
    const firstConfirm = window.confirm(
      "Warning: Deleting this collection will reverse all paid EMIs and delete the entire collection and related EMIs. Do you want to continue?"
    );
    if (!firstConfirm) return; // user cancelled

    // Step 2: Second confirmation
    const secondConfirm = window.confirm(
      "Are you absolutely sure you want to delete this collection?"
    );
    if (!secondConfirm) return; // user cancelled

    // Step 3: Proceed with deletion
    try {
      const response = await del(
        `${endPoints.deleteCollection}/${collectionId}`
      );

      if (response.status) {
        alert("Collection deleted successfully!");
        fetchTransactions();
      } else {
        alert(response.message || "Something went wrong while deleting.");
      }
    } catch (error) {
      console.error("Error deleting collection:", error.message || error);
      alert("Something went wrong while deleting collection.");
    }
  };
  const isAnyEmiPaid = (txId) => {
    return emiMap[txId]?.some((emi) => emi.emi_status === "Paid");
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-4 fw-bold">Collection</h4>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Transaction ID</th>
              <th>Transaction Type</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>To</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <React.Fragment key={tx.id}>
                  <tr
                    className={`cursor-pointer ${
                      expandedRow === tx.id ? "table-info" : ""
                    }`}
                    onClick={(e) => {
                      if (!e.target.closest("button")) {
                        toggleRow(tx.id);
                      }
                    }}
                  >
                    <td>{tx.id}</td>
                    <td>{tx.transaction_type}</td>
                    <td>
                      {tx.transaction_date && tx.transaction_time
                        ? `${tx.transaction_date.split("T")[0]} ${
                            tx.transaction_time
                          }`
                        : "N/A"}
                    </td>
                    <td>{tx.category || "N/A"}</td>
                    <td>{tx.description || "N/A"}</td>
                    <td>{tx.target_acc_name || "N/A"}</td>
                    <td>
                      {tx.coll_total_amount
                        ? `${tx.coll_total_amount} ₹`
                        : "N/A"}
                    </td>
                    <td>
                      <div className="mt-2 text">
                        <span
                          title={
                            isAnyEmiPaid(tx.id)
                              ? "Cannot edit collection because some EMI is already paid"
                              : "Edit Collection"
                          }
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-primary me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAnyEmiPaid(tx.id)) {
                                openEditModal(tx);
                              }
                            }}
                            disabled={isAnyEmiPaid(tx.id)}
                          >
                            <i className="bi bi-pencil-square me-1"></i>
                          </button>
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCollection(tx.id);
                          }}
                        >
                          <i className="bi bi-trash me-1"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRow === tx.id && (
                    <tr>
                      <td colSpan="8" className="bg-light">
                        <div className="mb-2">
                          <strong>Repayment Type:</strong>{" "}
                          {tx.coll_kisht_type
                            ? tx.coll_kisht_type.toUpperCase()
                            : "N/A"}
                        </div>
                        <div className="mb-3">
                          <strong>EMI Summary:</strong>
                          <ul className="mb-0 ps-3">
                            <li>Total EMIs: {tx.coll_emi_times || 0}</li>
                          </ul>
                        </div>

                        {emiMap[tx.id] && emiMap[tx.id].length > 0 && (
                          <>
                            <strong>EMI Details:</strong>
                            <table className="table table-sm mt-2 mb-0">
                              <thead className="table-secondary">
                                <tr>
                                  <th>EMI Amount</th>
                                  <th>Status</th>
                                  <th>Due Date</th>
                                  <th>Source Account</th>
                                  <th>Target Account</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {emiMap[tx.id].map((emi, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      {emi.amount ? `${emi.amount} ₹` : "N/A"}
                                    </td>
                                    <td>{emi.emi_status || "N/A"}</td>
                                    <td>
                                      {emi.coll_emiDue_date?.split("T")[0] ||
                                        "N/A"}
                                    </td>
                                    <td>{emi.source_acc_name || "N/A"}</td>
                                    <td>{emi.target_acc_name || "N/A"}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className={`btn btn-sm ${
                                          emi.emi_status === "Paid"
                                            ? "btn-success"
                                            : "btn-outline-success"
                                        }`}
                                        onClick={() => handleEditOneEmi(emi)}
                                        disabled={emi.emi_status === "Paid"}
                                      >
                                        <i className="bi bi-check-circle me-1"></i>
                                        Mark as Paid
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="mt-2 text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAllEmi(tx);
                                }}
                                disabled={emiMap[tx.id].every(
                                  (emi) => emi.collection_status === "Completed"
                                )}
                                title={
                                  emiMap[tx.id].every(
                                    (emi) =>
                                      emi.collection_status === "Completed"
                                  )
                                    ? "Already Completed"
                                    : "Mark All as Paid"
                                }
                              >
                                <i className="bi bi-check-circle me-1"></i>
                                Mark All as Paid
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Collection found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editCollection && (
        <EditCollectionModal
          show={showModal}
          handleClose={closeEditModal}
          collection={editCollection}
          refresh={fetchTransactions}
        />
      )}
    </div>
  );
}

export default Collection;
