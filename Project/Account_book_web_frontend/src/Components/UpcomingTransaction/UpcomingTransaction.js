import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import "./UpcomingTransactions.css";

function UpcomingTransactions() {
  const { get, post } = useApi();
  const [combinedList, setCombinedList] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchTransactions = async (search = "") => {
    const bookId = localStorage.getItem("bookId");

    try {
      const response = await get(
        endPoints.get_all_upcoming_collections_and_transactions,
        {
          params: { search, bookId },
        }
      );

      if (response?.data) {
        const { collections = [], transactions = [] } = response.data;

        const combined = [...collections, ...transactions].sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        );

        setCombinedList(combined);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error.message || error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  useEffect(() => {
    const handleBookChange = (e) => {
      const updatedBookId = localStorage.getItem("bookId");
      fetchTransactions(searchTerm); // use existing searchTerm state
    };

    window.addEventListener("selectedBookUpdated", handleBookChange);

    // Clean up
    return () => {
      window.removeEventListener("selectedBookUpdated", handleBookChange);
    };
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchTransactions(value);
  };

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
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
        alert("EMI status updated successfully!");
        fetchTransactions();
      } else {
        alert(response.message || "Something went wrong.");
      }
    } catch (error) {
      alert(error.message || "Error updating EMI.");
    }
  };

  const handleEditAllEmi = async (emis) => {
    try {
      const payload = {
        accountId: emis.map((e) => e.accountId),
        to_account: emis[0]?.to_account,
        collection_status: "Completed",
      };

      const response = await post(endPoints.updateCollectionStatus, payload);

      if (response.status) {
        alert("All EMIs marked as paid!");
        fetchTransactions();
      } else {
        alert(response.message || "Error while updating.");
      }
    } catch (error) {
      alert(error.message || "Error updating all EMIs.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3 fw-bold">Upcoming Transactions</h4>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by category "
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {combinedList.length > 0 ? (
              combinedList.map((item) => {
                const isCollection = item.type === "COLLECTION";
                const emiList = item.emi_transaction || [];
                const totalEmis = emiList.length;
                const completedEmis = emiList.filter(
                  (e) => e.collection_status === "Completed"
                ).length;
                const pendingEmis = totalEmis - completedEmis;
                const allEmisPaid = isCollection && pendingEmis === 0;

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`${isCollection ? "cursor-pointer" : ""} ${
                        expandedRow === item.id ? "table-info" : ""
                      }`}
                      onClick={() => isCollection && toggleRow(item.id)}
                    >
                      <td>{item.id}</td>
                      <td>{item.transaction_type}</td>
                      <td>
                        {item.transaction_date?.split("T")[0]}{" "}
                        {item.transaction_time}
                      </td>
                      <td>{item.category || "N/A"}</td>
                      <td>{item.description || "N/A"}</td>
                      <td>{item.target_acc_name || "N/A"}</td>
                      <td>
                        {isCollection
                          ? `${item.coll_total_amount} ₹`
                          : `${item.amount} ₹`}
                      </td>
                    </tr>

                    {isCollection && expandedRow === item.id && (
                      <tr>
                        <td colSpan="7" className="bg-light">
                          <div className="mb-2">
                            <strong>Repayment Type:</strong>{" "}
                            {item.coll_kisht_type?.toUpperCase() || "N/A"}
                          </div>
                          <div className="mb-2">
                            <strong>Payment Status:</strong>{" "}
                            {allEmisPaid ? (
                              <span className="badge bg-success">
                                Fully Paid
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="mb-2">
                            <strong>EMI Summary:</strong>
                            <ul className="ps-3 mb-0">
                              <li>Total EMIs: {totalEmis}</li>
                              <li>Completed: {completedEmis}</li>
                              <li>Pending: {pendingEmis}</li>
                            </ul>
                          </div>

                          <strong>EMI Details:</strong>
                          <table className="table table-sm table-bordered mt-2">
                            <thead className="table-secondary">
                              <tr>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Source</th>
                                <th>Target</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {emiList.map((emi, idx) => {
                                const isPaid =
                                  emi.collection_status === "Completed";

                                return (
                                  <tr key={idx}>
                                    <td>{emi.amount} ₹</td>
                                    <td>
                                      {emi.coll_emiDue_date?.split("T")[0]}
                                    </td>
                                    <td>
                                      <span
                                        className={`badge ${
                                          isPaid ? "bg-success" : "bg-danger"
                                        }`}
                                      >
                                        {isPaid ? "Paid" : "Unpaid"}
                                      </span>
                                    </td>
                                    <td>{emi.source_acc_name || "N/A"}</td>
                                    <td>{emi.target_acc_name || "N/A"}</td>
                                    <td>
                                      <button
                                        className={`btn btn-sm ${
                                          isPaid
                                            ? "btn-success"
                                            : "btn-outline-success"
                                        }`}
                                        onClick={() => handleEditOneEmi(emi)}
                                        disabled={isPaid}
                                      >
                                        Mark Paid
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          <div className="text-end">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditAllEmi(emiList)}
                              disabled={allEmisPaid}
                            >
                              <i className="bi bi-check-circle me-1" />
                              Mark All as Paid
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No upcoming transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpcomingTransactions;
