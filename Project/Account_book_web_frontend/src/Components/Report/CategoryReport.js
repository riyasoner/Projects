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
import { pdf } from "@react-pdf/renderer";
import CategoryPDF from "./CategoryPdf";
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

const CategoryReport = ({ category }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { get } = useApi();
  const bookId = localStorage.getItem("bookId");
  const formatDate = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const fetchReportData = async () => {
    if (!bookId || !category) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        bookId,
        filter_type: period,
        category,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      };

      const response = await get(endPoints.getCategoryWiseReport, { params });

      if (response?.status && response.data) {
        setReportData(response.data);
      } else {
        setReportData(null);
      }
    } catch (err) {
      // setError('Error fetching data');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!reportData) return;

    try {
      const blob = await pdf(
        <CategoryPDF
          category={category}
          period={period}
          fromDate={fromDate}
          toDate={toDate}
          reportData={reportData}
        />
      ).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${category}-Report.pdf`;
      link.click();
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };
  const handleExcelDownload = () => {
    if (!reportData || Object.keys(reportData).length === 0) return;

    const rows = Object.entries(reportData).map(([date, values]) => ({
      Date: date,
      "Total Credits (Income)": values.totalCredits || 0,
      "Total Debits (Expense)": values.totalDebits || 0,
      "Net Amount": (values.totalCredits || 0) - (values.totalDebits || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `${category}-CategoryReport.xlsx`);
  };

  useEffect(() => {
    fetchReportData();
  }, [category, period, fromDate, toDate]);

  const getChartData = () => {
    if (!reportData) return null;

    const labels = Object.keys(reportData);
    const incomeData = labels.map((date) => reportData[date].totalCredits || 0);
    const expenseData = labels.map(
      (date) => -Math.abs(reportData[date].totalDebits || 0)
    );

    return {
      labels,
      datasets: [
        {
          label: "Positive",
          data: incomeData,
          backgroundColor: "rgba(75,192,192,0.6)",
        },
        {
          label: "Negative",
          data: expenseData,
          backgroundColor: "rgba(255,99,132,0.6)",
        },
      ],
    };
  };

  const chartOptions = {
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

  const data = getChartData();

  return (
    <div className="container mt-4">
      <div className="row justify-content-center mb-3">
        <div className="col-12 text-center">
          <h4>{category} Report</h4>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10">
          <div className="row g-3 align-items-end">
            {/* Period Selector */}
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

            {/* Action Buttons */}
            <div className="col-12 col-md-3 text-md-end text-start">
              <label className="form-label d-none d-md-block">&nbsp;</label>
              <div className="d-flex gap-3 justify-content-md-end justify-content-start">
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
              <Bar data={data} options={chartOptions} />
            ) : (
              <div className="text-center">No data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryReport;
