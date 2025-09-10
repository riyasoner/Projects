// ReportPDFDocument.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
        color: 'gray',
    },
    table: {
        display: "table",
        width: "auto",
        marginTop: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#d3d3d3",
        padding: 5,
        fontWeight: "bold",
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    netProfitPositive: {
        color: "green",
    },
    netProfitNegative: {
        color: "red",
    },
});

// Component
const ReportPDFDocument = ({ accountName, period, fromDate, toDate, reportData }) => {
    const formatCurrency = (value) => {
        return `$${value.toFixed(2)}`;
    };

    const formatDateForSubtitle = () => {
        if (fromDate && toDate) return `From ${fromDate} to ${toDate}`;
        if (fromDate) return `From ${fromDate}`;
        if (toDate) return `Up to ${toDate}`;
        return '';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{accountName} Report</Text>
                <Text style={styles.subtitle}>
                    {period.charAt(0).toUpperCase() + period.slice(1)} Report {formatDateForSubtitle()}
                </Text>

                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Period</Text>
                        <Text style={styles.tableColHeader}>Total Income</Text>
                        <Text style={styles.tableColHeader}>Total Expenses</Text>
                        <Text style={styles.tableColHeader}>Net Profit</Text>
                    </View>

                    {/* Table Body */}
                    {reportData && reportData.length > 0 ? (
                        reportData.map((item, idx) => {
                            const netProfit = item.totalCredits - item.totalDebits;
                            return (
                                <View style={styles.tableRow} key={idx}>
                                    <Text style={styles.tableCol}>{item.period}</Text>
                                    <Text style={styles.tableCol}>{formatCurrency(item.totalCredits)}</Text>
                                    <Text style={styles.tableCol}>{formatCurrency(item.totalDebits)}</Text>
                                    <Text
                                        style={[
                                            styles.tableCol,
                                            netProfit >= 0 ? styles.netProfitPositive : styles.netProfitNegative,
                                        ]}
                                    >
                                        {formatCurrency(netProfit)}
                                    </Text>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, { width: '100%', textAlign: 'center' }]}>
                                No data available
                            </Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default ReportPDFDocument;
