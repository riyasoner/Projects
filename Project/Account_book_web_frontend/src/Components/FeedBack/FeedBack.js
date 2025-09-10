import React, { useState, useEffect } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

function Feedback() {
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { get, post } = useApi();

    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    // Determine if userId should be included in API calls
    const shouldIncludeUserId = userType == "admin" || userType == "user";

    // Fetch feedback from the server
    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);

        let param = shouldIncludeUserId ? `?userId=${userId}` : "";

        try {
            const response = await get(`${endPoints.getFeedbacks}${param}`);
            if (response.status) {
                setFeedbackList(response.data);
            } else {
                setFeedbackList([]);
                setError("No feedback available.");
            }
        } catch (error) {
            setError("Error fetching feedback.");
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    // Handle the feedback form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (feedbackMessage.trim()) {
            const feedback = { description: feedbackMessage };

            // Include userId in the body if the user is an admin or a user
            if (shouldIncludeUserId) {
                feedback.userId = userId;
            }

            try {
                const response = await post(endPoints.addFeedback, feedback);
                if (response.status) {
                    setFeedbackMessage("");
                    fetchFeedback(); // Refresh the feedback list
                }
            } catch (error) {
                console.error("Error submitting feedback:", error);
                setError("Failed to submit feedback.");
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "70%" }}>
            <h4 className="mb-4" style={{ backgroundColor: "#419EB9", color: "white", padding: "10px" }}>
                <i className="bi bi-chat-left-text me-2"></i> Feedback
            </h4>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        rows="3"
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Write your feedback"
                        required
                    ></textarea>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        Send
                    </button>
                </div>
            </form>

            {/* Loading and Error Messages */}
            {loading && <p>Loading feedback...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Feedback List */}
            <div>
                {feedbackList.length === 0 && !loading && !error && (
                    <p className="text-muted">No feedback available.</p>
                )}

                {feedbackList.map((feedback) => (
                    <div key={feedback.id} className="mb-3 p-3 border border-light rounded">
                        <div>{feedback.description}</div>
                        <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                            {new Date(feedback.createdAt).toLocaleString()}
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feedback;
