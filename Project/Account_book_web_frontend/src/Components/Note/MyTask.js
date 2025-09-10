import React from "react";
import { FaTasks } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const MyTasks = ({ data = [] }) => {
  return (
    <div className="container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center text-white p-2" style={{ background: "#419EB9" }}>
        <div className="d-flex align-items-center">
          <FaTasks className="me-2" />
          <span>My Tasks</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-3">
        {data.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          data.map((task) => (
            <div key={task.id} className="d-flex align-items-start bg-light p-3 mb-2 border rounded">
              <div className="flex-grow-1">
                <p className="mb-1 fw-bold">{task.description}</p>
                <small className="text-muted">
                  {task.completed ? (
                    <span className="text-success">Completed</span>
                  ) : (
                    <span className="text-danger">Pending</span>
                  )}
                  {" | "}
                  Created At: {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTasks;
