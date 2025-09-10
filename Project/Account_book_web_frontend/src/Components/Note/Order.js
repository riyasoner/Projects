import React from "react";
import { FaClipboardList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Order = ({ data = [] }) => {
  return (
    <div className="container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center text-white p-2" style={{ background: "#419EB9" }}>
        <div className="d-flex align-items-center">
          <FaClipboardList className="me-2" />
          <span>Order</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-3">
        {data.length === 0 ? (
          <p className="text-muted">No orders available.</p>
        ) : (
          <ul className="list-group">
            {data.map((order) => (
              <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{order.description}</strong> - {order.type_of_notes}
                  <br />
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} | {order.completed ? "✅ Completed" : "❌ Pending"}
                    {order.is_postponde && order.postponded_date
                      ? ` | ⏳ Postponed to ${new Date(order.postponded_date).toLocaleDateString()}`
                      : ""}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Order;
