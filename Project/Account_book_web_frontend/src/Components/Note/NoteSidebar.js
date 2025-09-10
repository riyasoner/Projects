import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaTasks,
  FaClipboardCheck,
  FaTrashAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import Notes from "./Note";
import WaitingList from "./WaitingTask";
import Order from "./Order";
import MyTasks from "./MyTask";
import Postponed from "./Postponed";
import Completed from "./Completed";
import Deleted from "./Deleted";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const NoteSidebar = () => {
  const { get } = useApi();
  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data only when a tab is clicked
  useEffect(() => {
    if (activeTab) {
      fetchData(activeTab);
    }
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true); // Start loading

    const userId = localStorage.getItem("userId");
    const bookId = localStorage.getItem("bookId");
    const userType = localStorage.getItem("userType");

    let param = "";
    switch (tab) {
      case "Notes":
        // param = "type_of_notes=addNote";
        break;
      case "Order":
        param = "type_of_notes=order";
        break;
      case "My Tasks":
        param = "type_of_notes=task";
        break;
      case "Postponed":
        param = "is_postponde=true";
        break;
      case "Completed":
        param = "completed=true";
        break;
      case "Deleted":
        param = "deleted=true";
        break;
      default:
        param = "";
    }

    // Append userId and bookId only if userType is "admin" or "user"
    if (userType == "admin" || userType == "user") {
      param += `&userId=${userId}&bookId=${bookId}`;
    }
    if (userType == "super_admin") {
      param += `&userId=${userId}`;
    }
    try {
      const response = await get(`${endPoints.getNotes}?${param}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderComponent = () => {
    if (loading) return <p className="text-center mt-3">Loading...</p>;

    switch (activeTab) {
      case "Notes":
        return <Notes data={data} fetchNotes={fetchData} />;
      case "Waiting Tasks":
        return <WaitingList />;
      case "Order":
        return <Order data={data} />;
      case "My Tasks":
        return <MyTasks data={data} />;
      case "Postponed":
        return <Postponed data={data} />;
      case "Completed":
        return <Completed data={data} />;
      case "Deleted":
        return <Deleted data={data} />;
      default:
        return (
          <div className="text-center  p-4 bg-light border rounded shadow-sm text-muted">
            <h5>Select a tab to view data</h5>
            <p className="small">Use the menu on the left to begin</p>
          </div>
        );
    }
  };

  const menuItems = [
    { label: "Notes", icon: <FaBook /> },
    { label: "Waiting Tasks", icon: <FaClock /> },
    { label: "Order", icon: <FaClipboardList /> },
    { label: "My Tasks", icon: <FaTasks /> },
    { label: "Postponed", icon: <FaClipboardCheck /> },
    { label: "Completed", icon: <FaClipboardCheck /> },
    { label: "Deleted", icon: <FaTrashAlt /> },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar bg-light p-1"
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
        <div
          className="mb-2"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1001,
            backgroundColor: "#419EB9",
            color: "white",
            padding: "4px",
          }}
        >
          <h5 className="text-uppercase d-flex align-items-left">Notes</h5>
        </div>

        <ul className="list-unstyled mt-2">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`d-flex align-items-center ${
                activeTab === item.label ? "active-tab" : ""
              }`}
              style={{
                padding: "10px",
                margin: "0",
                cursor: "pointer",
                borderLeft:
                  activeTab === item.label
                    ? "4px solid green"
                    : "4px solid transparent",
                backgroundColor:
                  activeTab === item.label ? "#f0f8ff" : "transparent",
                borderBottom: "1px solid #ccc",
              }}
              onClick={() => setActiveTab(item.label)}
            >
              {item.icon}
              <span className="ms-2">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div
        className="content"
        style={{
          marginLeft: "290px", // Adjust this value to match the sidebar width and layout
          flex: 1,
        }}
      >
        {renderComponent()}
      </div>
    </div>
  );
};

export default NoteSidebar;
