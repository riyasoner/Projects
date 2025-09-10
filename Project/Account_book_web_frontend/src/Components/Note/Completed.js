import React from "react";
import { FaClipboardCheck } from "react-icons/fa"; 
import "bootstrap/dist/css/bootstrap.min.css";

const Completed = ({ data = [] }) => {
    return (
        <div className="container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center text-white p-2" style={{ background: "#419EB9" }}>
                <div className="d-flex align-items-center">
                    <FaClipboardCheck className="me-2" /> 
                    <span>Completed</span>
                </div>
            </div>

            {/* Notes List */}
            <div className="p-3">
                {data.length === 0 ? (
                    <p>No completed notes available.</p>
                ) : (
                    <ul className="list-group">
                        {data.map((note) => (
                            <li key={note.id} className="list-group-item">
                                <strong>Type:</strong> {note.type_of_notes} <br />
                                <strong>Description:</strong> {note.description} <br />
                                <strong>Completed On:</strong> {new Date(note.updatedAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Completed;
