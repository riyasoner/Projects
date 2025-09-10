import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Deleted = ({ data = [] }) => {
  console.log(data , "de")
  return (
    <div className="container">
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center text-white p-2"
        style={{ background: "#419EB9" }}
      >
        <div className="d-flex align-items-center">
          <FaTrashAlt className="me-2" />
          <span>Deleted Notes</span>
        </div>
      </div>

      {/* Notes List */}
      <div className="p-3">
        {data.length === 0 ? (
          <p className="text-muted text-center">No deleted notes found.</p>
        ) : (
          <ul className="list-group">
            {data.map((note) => (
              <li key={note.id} className="list-group-item">
                <div>
                  <strong>{note.type_of_notes.toUpperCase()}</strong>
                </div>
                <p className="mb-1">{note.description}</p>
                <small className="text-muted">
                  Created: {new Date(note.createdAt).toLocaleDateString()} | Updated:{" "}
                  {new Date(note.updatedAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Deleted;
