// PeriodicReport.jsx
import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import ReportPDFDocument from "./ReportPDFDownload";
import { pdf } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PeriodicReport = ({ sectionName }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const chartRef = useRef(null);

  const { get } = useApi();
  const bookId = localStorage.getItem("bookId");
  const loggedInUserId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const fetchUsers = async () => {
    try {
      const response = await get(
        `${endPoints.getAllUser}?createdByUserId=${loggedInUserId}`
      );
      if (response.status && Array.isArray(response.data)) {
        setUserList(response.data);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchReportData = async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = { bookId, ...customParams };
      const response = await get(endPoints.getTransactionsTypeReport, {
        params,
      });
      if (response.status && response.data) setReportData(response.data);
      else setReportData(null);
    } catch (err) {
      setReportData(null);
      setError("No data Found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
    if (userType === "super_admin") fetchUsers();
  }, []);

  useEffect(() => {
    if (!filtersApplied) return;

    const formatDate = (dateStr) =>
      dateStr ? dayjs(dateStr).format("MM-DD-YYYY") : "";

    const params = {
      filter_type: period,
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
    };

    if (userType === "super_admin" && selectedUserId)
      params.userId = selectedUserId;
    else if (userType !== "super_admin") params.userId = loggedInUserId;

    fetchReportData(params);
  }, [period, fromDate, toDate, selectedUserId]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);

    setFiltersApplied(true);
  };

  const getDataForSection = (section) => {
    if (!reportData || Object.keys(reportData).length === 0) return null;
    const labels = Object.keys(reportData);
    const summaryMap = {
      "Income-Expense": {
        datasets: [
          {
            label: "Income",
            data: labels.map(
              (key) => reportData[key].Income_Expense_Summary?.totalIncome || 0
            ),
            backgroundColor: "rgba(75,192,192,0.6)",
          },
          {
            label: "Expenses",
            data: labels.map(
              (key) => reportData[key].Income_Expense_Summary?.totalExpense || 0
            ),
            backgroundColor: "rgba(255,99,132,0.6)",
          },
        ],
      },
      "Payment-Collection": {
        datasets: [
          {
            label: "Payments",
            data: labels.map(
              (key) =>
                reportData[key].Collection_Payment_Summary?.totalPayment || 0
            ),
            backgroundColor: "rgba(54,162,235,0.6)",
          },
          {
            label: "Collections",
            data: labels.map(
              (key) =>
                reportData[key].Collection_Payment_Summary?.totalCollection || 0
            ),
            backgroundColor: "rgba(243, 58, 215, 0.6)",
          },
        ],
      },
      "Purchase-Sale": {
        datasets: [
          {
            label: "Purchase",
            data: labels.map(
              (key) => reportData[key].Sale_Purchase_Summary?.totalPurchase || 0
            ),
            backgroundColor: "rgba(54,162,235,0.6)",
          },
          {
            label: "Sale",
            data: labels.map(
              (key) => reportData[key].Sale_Purchase_Summary?.totalSale || 0
            ),
            backgroundColor: "rgba(243, 58, 215, 0.6)",
          },
        ],
      },
    };

    return {
      labels,
      datasets: summaryMap[section]?.datasets || [],
    };
  };

  const chartData = getDataForSection(sectionName);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `${sectionName} Report` },
    },
  };

  const tableData = reportData
    ? Object.entries(reportData).map(([date, data]) => {
        const entry = { date };
        if (sectionName === "Income-Expense") {
          entry.income = data.Income_Expense_Summary?.totalIncome || 0;
          entry.expense = data.Income_Expense_Summary?.totalExpense || 0;
          entry.total = data.Income_Expense_Summary?.totalInc_Exp || 0;
        } else if (sectionName === "Payment-Collection") {
          entry.payment = data.Collection_Payment_Summary?.totalPayment || 0;
          entry.collection =
            data.Collection_Payment_Summary?.totalCollection || 0;
          entry.total =
            data.Income_Expense_Summary?.total_collection_payment || 0;
        } else if (sectionName === "Purchase-Sale") {
          entry.purchase = data.Sale_Purchase_Summary?.totalPurchase || 0;
          entry.sale = data.Sale_Purchase_Summary?.totalSale || 0;
          entry.total = data.Income_Expense_Summary?.total_Sale_Purchase || 0;
        }
        return entry;
      })
    : [];
  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <ReportPDFDocument
          tableData={tableData}
          sectionName={sectionName}
          icon={
            <i
              className="bi bi-download"
              style={{ fontSize: 22, color: "black" }}
            />
          }
          buttonText="" // keep empty to show icon only
        />
      ).toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${sectionName}-PeriodicReport.pdf`; // <-- use backticks here!
      link.click();
    } catch (error) {
      console.error("Failed to download transactions:", error);
    }
  };
  const handleExcelDownload = () => {
    const exportData = tableData.map((row) => {
      const formattedRow = { Period: row.date };

      if (sectionName === "Income-Expense") {
        formattedRow.Income = row.income;
        formattedRow.Expense = row.expense;
        formattedRow["Total INR"] = row.total;
      } else if (sectionName === "Payment-Collection") {
        formattedRow.Payment = row.payment;
        formattedRow.Collection = row.collection;
        formattedRow["Total INR"] = row.total;
      } else if (sectionName === "Purchase-Sale") {
        formattedRow.Purchase = row.purchase;
        formattedRow.Sale = row.sale;
        formattedRow["Total INR"] = row.total;
      }

      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${sectionName} Report`);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${sectionName}-PeriodicReport.xlsx`);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <label>
          Period:
          <select
            value={period}
            onChange={handleFilterChange(setPeriod)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={handleFilterChange(setFromDate)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
          />
        </label>

        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={handleFilterChange(setToDate)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
          />
        </label>

        {userType === "super_admin" && (
          <label>
            User:
            <select
              value={selectedUserId}
              onChange={handleFilterChange(setSelectedUserId)}
              style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
            >
              <option value="">All Users</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username}
                </option>
              ))}
            </select>
          </label>
        )}

        <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <div style={{ cursor: "pointer" }} onClick={handleDownload}>
            <i
              className="bi bi-download"
              title="Download PDF"
              style={{ fontSize: 22, color: "black" }}
            />
          </div>

          <div style={{ cursor: "pointer" }} onClick={handleExcelDownload}>
            <i
              className="bi bi-file-earmark-excel"
              title="Download Excel"
              style={{ fontSize: 22, color: "green" }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {!loading && chartData && (
        <>
          <div style={{ marginLeft: "80px", width: "900px", height: "550px" }}>
            <Bar data={chartData} options={options} />
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "sans-serif",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Periods
                </th>

                {sectionName === "Income-Expense" && (
                  <>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Income
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Expense
                    </th>
                  </>
                )}
                {sectionName === "Payment-Collection" && (
                  <>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Payment
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Collection
                    </th>
                  </>
                )}
                {sectionName === "Purchase-Sale" && (
                  <>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Purchase
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Sale
                    </th>
                  </>
                )}
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Total INR
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {row.date}
                  </td>

                  {sectionName === "Income-Expense" && (
                    <>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.income?.toLocaleString()}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.expense?.toLocaleString()}
                      </td>
                    </>
                  )}
                  {sectionName === "Payment-Collection" && (
                    <>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.payment?.toLocaleString()}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.collection?.toLocaleString()}
                      </td>
                    </>
                  )}
                  {sectionName === "Purchase-Sale" && (
                    <>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.purchase?.toLocaleString()}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.sale?.toLocaleString()}
                      </td>
                    </>
                  )}

                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {row.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PeriodicReport;
