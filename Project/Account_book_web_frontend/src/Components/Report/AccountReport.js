import React, { useState, useEffect } from "react";
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
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import ReportPDFDocument from "./AccountPDf";
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

const AccountReport = ({ accountName, accountType }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { get } = useApi();

  const bookId = localStorage.getItem("bookId");

  const fetchReportData = async () => {
    try {
      if (!accountName && !accountType) return;

      setLoading(true);
      setError(null);

      // Format dates to MM-DD-YYYY if needed for backend
      const formatDate = (date) => {
        if (!date) return undefined;
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${month}-${day}-${year}`;
      };

      const params = {
        bookId,
        filter_type: period,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      };

      if (accountName) params.name = accountName;
      if (accountType) params.account_type = accountType;

      const apiUrl = accountName
        ? endPoints.getPeriodicReportByBookidAndAccountname
        : endPoints.getReportAccAccountType;
      const response = await get(apiUrl, { params });

      if (response.status && response.data.length > 0) {
        setReportData(response.data[0].report);
      } else {
        setReportData(null);
      }
    } catch (err) {
      setError("Error fetching data");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [accountName, accountType, period, fromDate, toDate]);

  const getChartData = () => {
    if (!reportData || reportData.length === 0) return null;

    const labels = reportData.map((item) => item.period);
    const incomeData = reportData.map((item) => item.totalCredits);
    const expenseData = reportData.map((item) => -item.totalDebits);

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "rgba(75,192,192,0.6)",
        },
        {
          label: "Expenses",
          data: expenseData,
          backgroundColor: "rgba(255,99,132,0.6)",
        },
      ],
    };
  };

  const data = getChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => (value < 0 ? `-${Math.abs(value)}` : value),
        },
      },
    },
  };
  const handleExcelDownload = () => {
    if (!reportData || reportData.length === 0) return;

    const formattedData = reportData.map((row) => ({
      Period: row.period,
      "Total Income (Credits)": row.totalCredits || 0,
      "Total Expense (Debits)": row.totalDebits || 0,
      "Net Amount": (row.totalCredits || 0) - (row.totalDebits || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const fileName = `${accountName || accountType}-PeriodicReport.xlsx`;
    saveAs(blob, fileName);
  };

  const handleDownload = async () => {
    if (!reportData) return;

    try {
      const blob = await pdf(
        <ReportPDFDocument
          accountName={accountName || accountType}
          period={period}
          fromDate={fromDate}
          toDate={toDate}
          reportData={reportData}
        />
      ).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${accountName || accountType}-PeriodicReport.pdf`;
      link.click();
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mb-4">
        <div className="col-12 text-center">
          <h4>{accountName || accountType} Report</h4>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8">
          <div className="row g-3 align-items-end">
            {/* Period Dropdown */}
            <div className="col-12 col-md-3">
              <label className="form-label">Period</label>
              <select
                className="form-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* From Date */}
            <div className="col-12 col-md-3">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="col-12 col-md-3">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Download Icons */}
            <div className="col-12 col-md-3 text-md-end text-start">
              <label className="form-label d-none d-md-block">&nbsp;</label>
              <div className="d-flex justify-content-md-end gap-3">
                <span
                  role="button"
                  onClick={handleDownload}
                  title="Download PDF Report"
                  className="text-dark"
                >
                  <i className="bi bi-download fs-4" />
                </span>
                <span
                  role="button"
                  onClick={handleExcelDownload}
                  title="Download Excel Report"
                  className="text-success"
                >
                  <i className="bi bi-file-earmark-excel fs-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <div className="chart-container">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-center text-danger">{error}</div>
            ) : data ? (
              <Bar data={data} options={options} />
            ) : (
              <div className="text-center">No data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountReport;
