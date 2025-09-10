// src/Components/Account/TransactionPDF.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  dateRange: { fontSize: 12, marginBottom: 15, textAlign: "center" },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    paddingBottom: 5,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: "1px solid #ccc",
  },
  col: {
    fontSize: 9,
    paddingRight: 4,
    overflow: "hidden",
  },
  colDate: { flex: 1 },
  colType: { flex: 1 },
  colToAcc: { flex: 1.5 },
  colDesc: { flex: 2 },
  colAmount: { flex: 1, textAlign: "right" },
  colBalance: { flex: 1, textAlign: "right" },
});

// Helper function to format date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  if (isNaN(date)) return "-";
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

// Types considered as debits
const debitTypes = ["EXPENSE", "PAYMENT", "INVENTORY_PURCHASE"];

const TransactionPDF = ({ transactions = [], fromDate, toDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Transaction Report</Text>
      <Text style={styles.dateRange}>
        From: {fromDate} | To: {toDate}
      </Text>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <Text style={[styles.col, styles.colDate]}>Date</Text>
        <Text style={[styles.col, styles.colType]}>Type</Text>
        <Text style={[styles.col, styles.colToAcc]}>To Account</Text>
        <Text style={[styles.col, styles.colDesc]}>Description</Text>
        <Text style={[styles.col, styles.colAmount]}>Amount </Text>
      </View>

      {/* Table Rows or No Data Message */}
      {transactions.length === 0 ? (
        <View style={{ padding: 10 }}>
          <Text
            style={{ fontSize: 12, textAlign: "center", marginTop: 20 }}
          >
            No transactions found for the selected date range.
          </Text>
        </View>
      ) : (
        transactions.map((txn, index) => {
          const isDebit = debitTypes.includes(txn.transaction_type);
          const amount = txn.amount ?? 0;
          return (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.col, styles.colDate]}>
                {formatDate(txn.transaction_date)}
              </Text>
              <Text style={[styles.col, styles.colType]}>
                {txn.transaction_type || "-"}
              </Text>
              <Text style={[styles.col, styles.colToAcc]}>
                {txn?.to_account_details?.name || "-"}
              </Text>
              <Text style={[styles.col, styles.colDesc]}>
                {txn.description || "-"}
              </Text>
              <Text
                style={[
                  styles.col,
                  styles.colAmount,
                  { color: isDebit ? "red" : "green" },
                ]}
              >
                {isDebit ? `- ${amount.toFixed(2)}` : amount.toFixed(2)}
              </Text>
            </View>
          );
        })
      )}
      {transactions.length > 0 && (
        <View style={{ marginTop: 20, paddingTop: 10, borderTop: '1px solid #000' }}>
          <Text
            style={{
              fontSize: 11,
              textAlign: 'right',
              color:
                transactions[0]?.account?.balance < 0 ? 'red' : 'black',
            }}
          >
            Available Balance:{" "}
            {typeof transactions[0]?.account?.balance === "number"
              ? transactions[0].account.balance.toFixed(2)
              : "-"}
          </Text>
        </View>
      )}

    </Page>
  </Document>
);

export default TransactionPDF;
