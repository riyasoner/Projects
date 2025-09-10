import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const Notification = () => {
  const { get, post } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userType = localStorage.getItem("userType");
        const userId = localStorage.getItem("userId");

        // Set params conditionally
        const params = {};
        if (
          userType === "admin" ||
          userType === "user" ||
          userType == "super_admin"
        ) {
          params.userId = userId;
        }
        const response = await get(endPoints.getNotification, { params });

        if (response.status) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle verification
  const handleVerify = async () => {
    if (!selectedNotification) return;
    const { source_id, bookId, transaction_id } = selectedNotification;

    try {
      const response = await post(endPoints.viewTransactionBySupAdmin, {
        accountId: source_id,
        bookId: bookId,
        transaction_id: transaction_id,
      });

      if (response.status) {
        alert(response.message || "Transaction verified successfully!");
      } else {
        alert("Failed to verify transaction.");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
    }
  };
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar bg-light p-2"
        style={{
          position: "fixed",
          top: "0",
          height: "100vh",
          width: "300px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          backgroundColor: "white",
          zIndex: 1000,
          marginTop: "67px",
        }}
      >
        <h5 className="p-2">Notifications</h5>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => setSelectedNotification(notification)}
                style={{
                  padding: "10px 15px",
                  borderBottom: "1px solid #eaeaea",
                  fontSize: "14px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedNotification?.id === notification.id
                      ? "#f0f8ff"
                      : "transparent",
                  borderLeft:
                    selectedNotification?.id === notification.id
                      ? "4px solid green"
                      : "4px solid transparent",
                }}
              >
                <strong>{notification.user?.name}</strong>:{" "}
                {notification.message}
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-muted">No notifications found</p>
          )}
        </ul>
      </div>

      {/* Content Area */}
      <div className="content p-3" style={{ marginLeft: "320px", flex: 1 }}>
        {selectedNotification ? (
          <div className="card p-3">
            <h4>Notification Details</h4>
            <p>
              <strong>Message:</strong> {selectedNotification.message}
            </p>
            <p>
              <strong>Type:</strong> {selectedNotification.type}
            </p>
            <p>
              <strong>User:</strong> {selectedNotification.user?.name} (
              {selectedNotification.user?.email_id})
            </p>
            <p>
              <strong>Phone:</strong> {selectedNotification.user?.phone_no}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>
            <button
              className="btn btn-success btn-sm"
              style={{
                width: "90px",
                fontSize: "18px",
                padding: "2px 5px",
                color: "white",
              }}
              onClick={handleVerify}
            >
              view
            </button>
          </div>
        ) : (
          <p className="text-center text-muted fs-5 my-4">
            Select a notification to view details.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notification;
