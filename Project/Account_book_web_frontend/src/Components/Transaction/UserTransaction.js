import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

function UserTransactions() {
  const { userId } = useParams(); // Get userId from the URL
  const { get, post } = useApi();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVerifyButton, setShowVerifyButton] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin" && userType !== "user") {
      setShowVerifyButton(true);
    }
    fetchTransactions();
  }, [userId]); // Fetch transactions when userId changes

  const fetchTransactions = async (category = "") => {
    setTransactions([]);

    try {
      const params = { userId }; // Pass userId in API request
      if (category) {
        params.category = category;
      }

      const response = await get(endPoints.getAllTransactions, { params });

      if (response?.data) {
        setTransactions(response.data);
      } else {
        console.warn("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error.message || error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchTransactions(value);
  };


  return (
    <div className="container mt-5">
      {/* <h4 className="mb-3">Transactions for User ID: {userId}</h4> */}
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
      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th scope="col">Transaction Type</th>
            <th scope="col">Date</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">To</th>
            <th scope="col">Amount</th>
            <th scope="col">View By SuperAdmin</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.transaction_type}</td>
                <td>
                  {transaction.transaction_date
                    ? transaction.transaction_date.split("T")[0]
                    : "N/A"}
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.target_acc_name}</td>
                <td>{transaction.amount} ₹</td>
                <td className="text-center">
                  <i
                    className="bi bi-eye-fill"
                    style={{
                      color: transaction.view_by_superAdmin ? "green" : "black",
                      fontSize: "1.5rem",
                    }}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showVerifyButton ? "8" : "7"} className="text-center">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTransactions;
