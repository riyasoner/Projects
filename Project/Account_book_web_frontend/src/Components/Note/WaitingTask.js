import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const WaitingList = () => {
  const { get } = useApi();
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWaitingList = async () => {
    setLoading(true);

    const userId = localStorage.getItem("userId");
    const bookId = localStorage.getItem("bookId");
    const userType = localStorage.getItem("userType");

    let param = "";
    if (userType == "admin" || userType == "user") {
      param = `?userId=${userId}&bookId=${bookId}`;
    }
    if (userType == "super_admin") {
      param = `?userId=${userId}`;
    }
    try {
      const response = await get(`${endPoints.getWaitingTask}${param}`);
      if (response?.data) {
        setWaitingList(response.data);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch waiting list.");
      console.error("Error fetching waiting list:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingList();
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center text-white p-2"
        style={{ background: "#419EB9" }}
      >
        <div className="d-flex align-items-center">
          <FaClock className="me-2" />
          <span>Waiting List</span>
        </div>
      </div>

      {/* Waiting Notes List */}
      <div className="p-3">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : waitingList.length === 0 ? (
          <p>No waiting list notes available.</p>
        ) : (
          waitingList.map((note) => (
            <div
              key={note.id}
              className="d-flex align-items-start bg-light p-3 mb-2 border rounded"
            >
              <div className="flex-grow-1">
                <p className="mb-1 fw-bold">{note.description}</p>
                <small className="text-muted">
                  {note.is_postponde ? (
                    <span className="text-warning">Postponed</span>
                  ) : (
                    <span className="text-primary">Waiting</span>
                  )}
                  {" | "}
                  Created At: {new Date(
                    note.createdAt
                  ).toLocaleDateString()}{" "}
                  {new Date(note.createdAt).toLocaleTimeString()}
                </small>
                {note.postponded_date && (
                  <p className="text-muted small">
                    Postponed Date:{" "}
                    {new Date(note.postponded_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WaitingList;
