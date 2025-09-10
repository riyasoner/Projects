import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import CategoryDistributionPDF from "./CategoryDistributionPdf"; // import the new component
import { pdf } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistribution = ({ sectionName }) => {
  const { get } = useApi();
  const [incomeData, setIncomeData] = useState({ labels: [], datasets: [] });
  const [expenseData, setExpenseData] = useState({ labels: [], datasets: [] });
  const [incomeTableData, setIncomeTableData] = useState([]);
  const [expenseTableData, setExpenseTableData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accounts, setAccounts] = useState([]);
  const bookId = localStorage.getItem("bookId");

  const handleAccountChange = (e) => setSelectedAccount(e.target.value);
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);
  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <CategoryDistributionPDF
          incomeTableData={incomeTableData}
          expenseTableData={expenseTableData}
          sectionName={sectionName}
        />
      ).toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${sectionName}-CategoryDistribution.pdf`; // <-- use backticks here!
      link.click();
    } catch (error) {
      console.error("Failed to download transactions:", error);
    }
  };
  const handleExcelDownload = () => {
    const formatRows = (rows, type) => {
      return rows.map((row) => ({
        Type: type,
        Category: row.category || "Uncategorized",
        "Transaction Count": row.transactionCount || 0,
        Total: row.totalAmount || 0,
      }));
    };

    const combinedData = [
      ...formatRows(incomeTableData, "Income"),
      ...formatRows(expenseTableData, "Expense"),
    ];

    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Distribution");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${sectionName}-CategoryDistribution.xlsx`);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await get(
          `${endPoints.getAllAccounts}?bookId=${bookId}`
        );
        setAccounts(response?.data || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, [get]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          bookId,
          name: selectedAccount,
          from_date: fromDate || "",
          to_date: toDate || "",
        };
        const response = await get(
          endPoints.getSuperAdminCategoryDistribution,
          { params }
        );
        const data = response.data?.[0] || {};

        const incomeCategories = [];
        const incomeValues = [];
        const expenseCategories = [];
        const expenseValues = [];
        const incomeRows = [];
        const expenseRows = [];
        let incomeTotal = 0;
        let expenseTotal = 0;

        Object.entries(data.income || {}).forEach(([month, categories]) => {
          Object.entries(categories || {}).forEach(([category, details]) => {
            if (details?.totalAmount) {
              incomeCategories.push(category || "Uncategorized");
              incomeValues.push(details.totalAmount);
              incomeRows.push({
                type: "Income",
                category: category || "Uncategorized",
                ...details,
              });
              incomeTotal += details.totalAmount;
            }
          });
        });

        Object.entries(data.expense || {}).forEach(([month, categories]) => {
          Object.entries(categories || {}).forEach(([category, details]) => {
            if (details?.totalAmount) {
              expenseCategories.push(category || "Uncategorized");
              expenseValues.push(details.totalAmount);
              expenseRows.push({
                type: "Expense",
                category: category || "Uncategorized",
                ...details,
              });
              expenseTotal += details.totalAmount;
            }
          });
        });

        setIncomeData({
          labels: incomeCategories,
          datasets: [
            {
              data: incomeValues,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverOffset: 4,
            },
          ],
        });
        setExpenseData({
          labels: expenseCategories,
          datasets: [
            {
              data: expenseValues,
              backgroundColor: ["#4BC0C0", "#FF9F40", "#FFCD56"],
              hoverOffset: 4,
            },
          ],
        });
        setIncomeTableData(incomeRows);
        setExpenseTableData(expenseRows);
      } catch (error) {
        console.error("Error fetching category distribution data:", error);
      }
    };

    fetchData();
  }, [get, bookId, selectedAccount, fromDate, toDate]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {sectionName} Category Distribution
      </h2>

      {/* Filter Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap", // optional, can change to "nowrap"
          marginBottom: "30px",
          gap: "15px",
        }}
      >
        <div style={{ flex: "1 1 22%" }}>
          <label
            htmlFor="accountSelect"
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            Select Account:
          </label>
          <select
            id="accountSelect"
            value={selectedAccount}
            onChange={handleAccountChange}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="">Select Account</option>
            {accounts.map((accountGroup) =>
              accountGroup.accounts.map((account) => (
                <option key={account.id} value={account.name}>
                  {account.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div style={{ flex: "1 1 22%" }}>
          <label
            htmlFor="fromDate"
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            From Date:
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>

        <div style={{ flex: "1 1 22%" }}>
          <label
            htmlFor="toDate"
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            To Date:
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>

        <div
          style={{
            flex: "1 1 22%",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            style={{ cursor: "pointer" }}
            onClick={handleDownload}
            title="Download PDF"
          >
            <i
              className="bi bi-download"
              style={{ fontSize: 22, color: "black" }}
            />
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={handleExcelDownload}
            title="Download Excel"
          >
            <i
              className="bi bi-file-earmark-excel"
              style={{ fontSize: 22, color: "green" }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ flex: "1 1 300px", maxWidth: "45%" }}>
          <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Income</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              flexDirection: "column",
            }}
          >
            {incomeData.labels.length > 0 ? (
              <Pie data={incomeData} />
            ) : (
              <p style={{ textAlign: "center" }}>No income data available</p>
            )}
          </div>
        </div>
        <div style={{ flex: "1 1 300px", maxWidth: "45%" }}>
          <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Expense</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              flexDirection: "column",
            }}
          >
            {expenseData.labels.length > 0 ? (
              <Pie data={expenseData} />
            ) : (
              <p style={{ textAlign: "center" }}>No expense data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div style={{ overflowX: "auto", marginBottom: "30px" }}>
        {/* <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Income Details</h4> */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Income
              </th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Transaction Count
              </th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {incomeTableData.length > 0 ? (
              incomeTableData.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {row.category || "Uncategorized"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {row.transactionCount || 0}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {row.totalAmount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No income data available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Total
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                }}
              ></td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {incomeTableData.reduce(
                  (sum, row) => sum + (row.totalAmount || 0),
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Expense Table */}
      <div style={{ overflowX: "auto" }}>
        {/* <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Expense Details</h4> */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Expense
              </th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Transaction Count
              </th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseTableData.length > 0 ? (
              expenseTableData.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {row.category || "Uncategorized"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {row.transactionCount || 0}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {row.totalAmount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No expense data available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Total
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                }}
              ></td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {expenseTableData.reduce(
                  (sum, row) => sum + (row.totalAmount || 0),
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CategoryDistribution;
