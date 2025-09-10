import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import icons
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

function SettlementRequests() {
    const { get, patch } = useApi();
    const [settlements, setSettlements] = useState([]);

    useEffect(() => {
        fetchSettlementRequests();
    }, []);

    const fetchSettlementRequests = async () => {
        try {
            const response = await get(endPoints.getPendingRequesForSettelment);
            if (response?.data) {
                setSettlements(response.data);
            } else {
                console.warn("No data received from API.");
            }
        } catch (error) {
            console.error("Error fetching settlements:", error);
        }
    };

    const handleUpdateStatus = async (accountId, userId, bookId, status) => {

        try {
            const response = await patch(
                `${endPoints.requestSettlement}?accountId=${accountId}&userId=${userId}&bookId=${bookId}&settlement_status=${status}`,
                {}
            );
            if (response.status) {
                alert(`Settlement marked as ${status}`);
                setSettlements((prev) =>
                    prev.map((s) => (s.accountId === accountId ? { ...s, settlement_status: status } : s))
                );
            } else {
                alert("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating settlement:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h4 className="mb-3">Settlement Requests</h4>
            <table className="table table-striped table-bordered">
                <thead className="table-primary">
                    <tr>
                        <th scope="col">Admin Name</th>
                        <th scope="col">Account Holder</th>
                        <th scope="col">Transaction Type</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Total Balance</th>
                        <th scope="col">Date</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {settlements.length > 0 ? (
                        settlements.map((settlement) => (
                            <tr key={settlement.id}>
                                <td>{settlement.user?.name}</td>
                                <td>{settlement.account?.name || "N/A"}</td>
                                <td>{settlement.transaction_type}</td>
                                <td>₹ {settlement.amount.toLocaleString()}</td>
                                <td>₹ {settlement.account?.balance?.toLocaleString()}</td>
                                <td>{settlement.transaction_date.split("T")[0]}</td>
                                <td>{settlement.description}</td>
                                <td>
                                    <span
                                        className={`badge ${settlement.settlement_status === "Approved"
                                            ? "bg-success"
                                            : settlement.settlement_status === "Rejected"
                                                ? "bg-danger"
                                                : "bg-warning"
                                            }`}
                                    >
                                        {settlement.settlement_status}
                                    </span>
                                </td>
                                <td>
                                    {settlement.settlement_status === "Pending" ? (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        settlement.accountId,
                                                        settlement.userId,
                                                        settlement.bookId,
                                                        "Approved"
                                                    )
                                                }
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        settlement.accountId,
                                                        settlement.userId,
                                                        settlement.bookId,
                                                        "Rejected"
                                                    )
                                                }
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <span
                                            className={
                                                settlement.settlement_status === "Approved"
                                                    ? "text-success"
                                                    : "text-danger"
                                            }
                                        >
                                            {settlement.settlement_status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">
                                No settlement requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SettlementRequests;
