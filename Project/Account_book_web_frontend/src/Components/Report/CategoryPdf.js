// components/CategoryPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  meta: {
    fontSize: 12,
    marginBottom: 3,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #ccc',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  column: {
    width: '33.33%',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const CategoryPDF = ({ category, period, fromDate, toDate, reportData }) => {
  const formattedData = Object.entries(reportData || {});

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{category} Report</Text>
          {/* <Text style={styles.meta}>Period: {period}</Text> */}
          <Text style={styles.meta}>
            {fromDate ? `From: ${fromDate}` : ''} {toDate ? `To: ${toDate}` : ''}
          </Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.column, styles.bold]}>Period</Text>
          <Text style={[styles.column, styles.bold]}>Income</Text>
          <Text style={[styles.column, styles.bold]}>Expense</Text>
        </View>

        {/* Table Rows */}
        {formattedData.length > 0 ? (
          formattedData.map(([periodKey, data], index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.column}>{periodKey}</Text>
              <Text style={styles.column}>{data.totalCredits || 0}</Text>
              <Text style={styles.column}>{data.totalDebits || 0}</Text>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 20, textAlign: 'center' }}>No data available.</Text>
        )}
      </Page>
    </Document>
  );
};

export default CategoryPDF;
