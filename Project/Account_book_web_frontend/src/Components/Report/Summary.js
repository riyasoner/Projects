import React, { useEffect, useState } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const Summary = () => {
    const { get } = useApi();
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSummaryData = async () => {
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem("userId");
        const bookId = localStorage.getItem("bookId");
        const userType = localStorage.getItem("userType");

        let param = "";
        if (userType == "admin" || userType == "user"|| userType == "super_admin") {
            param = `?bookId=${bookId}`;
        }

        try {
            const response = await get(`${endPoints.getAllAccountSummeryByBookId}${param}`);
            if (response?.status) {
                setSummaryData(response.data);
            } else {
                setSummaryData([]);
                setError("No data found.");
            }
        } catch (error) {
            setError("Failed to fetch summary data.");
            console.error("Error fetching summary data:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4 mt-3 ms-4">
                    <div>
                        <div className="p-2" style={{ backgroundColor: "#419EB9", color: "white" }}>
                            <h6 className="text-uppercase">Summary</h6>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && <p>Loading...</p>}

                    {/* Error Message */}
                    {error && <p className="text-danger">{error}</p>}

                    {/* No Data Message */}
                    {!loading && !error && summaryData.length === 0 && (
                        <p className="text-muted">No summary data available.</p>
                    )}

                    {/* Render Summary Data */}
                    {!loading && !error && summaryData.length > 0 && (
                        summaryData.map((item, index) => (
                            <div key={index} className="summary-section my-3">
                                <div className="category font-weight-bold d-flex justify-content-between" style={{ backgroundColor: "#E5EAEC" }}>
                                    <span>{item.account_type.replace("_", "/").toUpperCase()}</span>
                                    <span className={`net-profit ${item.netProfit >= 0 ? "text-success" : "text-danger"}`}>
                                        ${item.netProfit}
                                    </span>
                                </div>
                                <div className="amount-container d-flex justify-content-between">
                                    <span className="credit-amount text-primary">INR ₹ {item.totalCredits}</span>
                                    <span className="debit-amount text-danger">INR ₹ {item.totalDebits}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Summary;
