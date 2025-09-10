import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// Styles similar to TransactionPDF example
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  sectionTitle: { fontSize: 14, marginVertical: 10, fontWeight: "bold" },
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
    fontSize: 10,
    paddingRight: 4,
    overflow: "hidden",
  },
  colCategory: { flex: 2 },
  colCount: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderTop: "2px solid black",
    fontWeight: "bold",
    fontSize: 11,
  },
});

// Component for Income or Expense Table
const CategoryTable = ({ title, data }) => {
  const totalAmount = data.reduce((sum, row) => sum + (row.totalAmount || 0), 0);

  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.col, styles.colCategory]}>{title}</Text>
        <Text style={[styles.col, styles.colCount]}>Transaction Count</Text>
        <Text style={[styles.col, styles.colAmount]}>Total</Text>
      </View>
      {data.map(({ category, transactionCount, totalAmount }, i) => (
        <View style={styles.tableRow} key={i}>
          <Text style={[styles.col, styles.colCategory]}>{category || "Uncategorized"}</Text>
          <Text style={[styles.col, styles.colCount]}>{transactionCount || 0}</Text>
          <Text style={[styles.col, styles.colAmount]}>{totalAmount?.toFixed(2) || "0.00"}</Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={[styles.col, styles.colCategory]}>Total</Text>
        <Text style={[styles.col, styles.colCount]}></Text>
        <Text style={[styles.col, styles.colAmount]}>{totalAmount.toFixed(2)}</Text>
      </View>
    </>
  );
};

const CategoryDistributionPDF = ({ incomeTableData, expenseTableData, sectionName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{sectionName} - Category Distribution Report</Text>

      <CategoryTable title="Income" data={incomeTableData} />
      <CategoryTable title="Expense" data={expenseTableData} />
    </Page>
  </Document>
);

export default CategoryDistributionPDF;
