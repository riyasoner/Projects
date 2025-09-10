import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import endPoints from '../../api/endPoints';
import useApi from '../../hooks/useApi';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistributionName = ({ accountName }) => {
  const { get } = useApi();
  const [incomeData, setIncomeData] = useState({ labels: [], datasets: [] });
  const [expenseData, setExpenseData] = useState({ labels: [], datasets: [] });
  const [incomeTableData, setIncomeTableData] = useState([]);
  const [expenseTableData, setExpenseTableData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const bookId = localStorage.getItem("bookId");

  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          bookId,
          name: accountName,
          from_date: fromDate || '',
          to_date: toDate || '',
        };
        const response = await get(endPoints.getCategoryDistribution, { params });
        const data = response.data?.[0] || {};

        const incomeCategories = [];
        const incomeValues = [];
        const expenseCategories = [];
        const expenseValues = [];
        const incomeTable = [];
        const expenseTable = [];

        Object.entries(data.income || {}).forEach(([_, categories]) => {
          Object.entries(categories || {}).forEach(([category, details]) => {
            if (details?.totalAmount) {
              incomeCategories.push(category || 'Uncategorized');
              incomeValues.push(details.totalAmount);
              incomeTable.push({
                category: category || 'Uncategorized',
                transactionCount: details.transactionCount || 0,
                totalAmount: details.totalAmount,
              });
            }
          });
        });

        Object.entries(data.expense || {}).forEach(([_, categories]) => {
          Object.entries(categories || {}).forEach(([category, details]) => {
            if (details?.totalAmount) {
              expenseCategories.push(category || 'Uncategorized');
              expenseValues.push(details.totalAmount);
              expenseTable.push({
                category: category || 'Uncategorized',
                transactionCount: details.transactionCount || 0,
                totalAmount: details.totalAmount,
              });
            }
          });
        });

        setIncomeData({
          labels: incomeCategories,
          datasets: [{ data: incomeValues, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], hoverOffset: 4 }],
        });
        setExpenseData({
          labels: expenseCategories,
          datasets: [{ data: expenseValues, backgroundColor: ['#4BC0C0', '#FF9F40', '#FFCD56'], hoverOffset: 4 }],
        });

        setIncomeTableData(incomeTable);
        setExpenseTableData(expenseTable);
      } catch (error) {
        console.error('Error fetching category distribution data:', error);
      }
    };
    
    fetchData();
  }, [get, bookId, accountName, fromDate, toDate]);

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{accountName} Category Distribution</h2>
      
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input type="date" value={fromDate} onChange={handleFromDateChange} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginRight:"10px"}} />
        <input type="date" value={toDate} onChange={handleToDateChange} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ flex: "1 1 300px", maxWidth: "35%" }}>
          <h4 style={{ textAlign: "center" }}>Income</h4>
          {incomeData.labels.length > 0 ? <Pie data={incomeData} /> : <p style={{ textAlign: "center" }}>No income data available</p>}
        </div>
        <div style={{ flex: "1 1 300px", maxWidth: "35%" }}>
          <h4 style={{ textAlign: "center" }}>Expense</h4>
          {expenseData.labels.length > 0 ? <Pie data={expenseData} /> : <p style={{ textAlign: "center" }}>No expense data available</p>}
        </div>
      </div>

      {/* Income Table */}
      <div style={{ overflowX: "auto", marginTop: "30px" }}>
        <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Income Details</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Income</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Transaction Count</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {incomeTableData.length > 0 ? (
              incomeTableData.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{row.category}</td>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{row.transactionCount}</td>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{row.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "12px" }}>No income data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expense Table */}
      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Expense Details</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Expense</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Transaction Count</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {expenseTableData.length > 0 ? (
              expenseTableData.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{row.category}</td>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{row.transactionCount}</td>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{row.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "12px" }}>No expense data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDistributionName;
