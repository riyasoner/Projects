import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginTop: 10,
  },
  tableRow: { flexDirection: 'row' },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    borderColor: '#bfbfbf',
    padding: 6,
    fontWeight: 'bold',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 6,
  },
});

const ReportPDFDocument = ({ tableData, sectionName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{sectionName} Report</Text>

      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: '25%' }]}>
            <Text>Periods</Text>
          </View>

          {sectionName === 'Income-Expense' && (
            <>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text>Income</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text>Expense</Text>
              </View>
            </>
          )}

          {sectionName === 'Payment-Collection' && (
            <>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text>Payment</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text>Collection</Text>
              </View>
            </>
          )}

          {sectionName === 'Purchase-Sale' && (
            <>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text>Purchase</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text>Sale</Text>
              </View>
            </>
          )}

          <View style={[styles.tableColHeader, { width: '25%' }]}>
            <Text>Total INR</Text>
          </View>
        </View>

        {/* Body */}
        {tableData.map((row, idx) => (
          <View style={styles.tableRow} key={idx}>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text>{row.date}</Text>
            </View>

            {sectionName === 'Income-Expense' && (
              <>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text>{row.income?.toLocaleString()}</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text>{row.expense?.toLocaleString()}</Text>
                </View>
              </>
            )}

            {sectionName === 'Payment-Collection' && (
              <>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text>{row.payment?.toLocaleString()}</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text>{row.collection?.toLocaleString()}</Text>
                </View>
              </>
            )}

            {sectionName === 'Purchase-Sale' && (
              <>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text>{row.purchase?.toLocaleString()}</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text>{row.sale?.toLocaleString()}</Text>
                </View>
              </>
            )}

            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text>{row.total?.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportPDFDocument;
