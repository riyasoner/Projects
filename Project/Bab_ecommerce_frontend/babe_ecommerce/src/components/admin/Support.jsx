import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { FiMail } from "react-icons/fi";



function Support() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [stats, setStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReplyModel, setShowReplyModel] = useState(false)
  const [replyMessage, setReplyMessage] = useState("");
  const [ticketId, setTicketId] = useState(null)

  // useEffect(()=>{
  //   fetchStats();

  // },[])

  // const fetchStats=async()=>{
  //   try {
  //     const response=await get(endpoints.getSupportTicketSummary);
  //     setStats(response.data)

  //   } catch (error) {
  //     console.log("Error in fetching Stats",error)
  //   }
  // }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await get(endpoints.getSupportTicketSummary);
        const d = res.data || {};


        setStats([
          { title: "Total Tickets", count: d.totalTickets ?? 0, change: "0.0%" },
          { title: "Open", count: d.openTickets ?? 0, change: "0.0%" },
          { title: "In Progress", count: d.inProgressTickets ?? 0, change: "0.0%" },
          { title: "Resolved", count: d.resolvedTickets ?? 0, change: "0.0%" },
          { title: "Closed", count: d.closedTickets ?? 0, change: "0.0%" },
        ]);
      } catch (error) {
        console.error("Error in fetching stats:", error);
      }
    };

    fetchStats();
  }, []);



  // -------- status‑modal state --------
  const [statusModal, setStatusModal] = useState({
    open: false,
    id: null,
    status: "open",
  });

  const { get, patch, del, post } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [filters, currentPage]);

  const fetchTickets = async () => {
    try {
      const query = [];
      if (filters.status) query.push(`status=${filters.status}`);
      if (filters.priority) query.push(`priority=${filters.priority}`);
      query.push(`page=${currentPage}`);

      const response = await get(
        `${endpoints.getAllTickets}?${query.join("&")}`
      );
      const { tickets, totalPages: tp } = response.data || {};
      setTickets(tickets || []);
      setTotalPages(tp || 1);
    } catch (error) {
      console.log("Error in fetching Tickets", error);
    }
  };

  // ---------- status‑update helpers ----------
  const openStatusModal = (id, currentStatus) => {
    setStatusModal({ open: true, id, status: currentStatus || "open" });
  };

  const closeStatusModal = () =>
    setStatusModal({ open: false, id: null, status: "open" });

  const saveStatus = async () => {
    try {
      await patch(`${endpoints.updateTicketStatus}/${statusModal.id}`, {
        status: statusModal.status,
      });
      closeStatusModal();
      fetchTickets();
    } catch (error) {
      console.log("Error updating ticket status", error);
    }
  };

  // ---------- delete ----------
  const handleDelete = async (id) => {
    try {
      await del(`${endpoints.deleteTicket}/${id}`);
      fetchTickets();
    } catch (error) {
      console.log("Error deleting ticket", error);
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Ticket?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(id) },
        { label: "No" },
      ],
      overlayClassName: "custom-overlay"
    });
  };

  const statsTemplate = [
    { title: "Total Tickets", count: 0, change: "0.0%" },
    { title: "Open Tickets", count: 0, change: "0.0%" },
    { title: "In Progress", count: 0, change: "0.0%" },
    { title: "Closed Tickets", count: 0, change: "0.0%" },
  ];


  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please enter a message.");
      return;
    }

    const payload = {
      ticketId: ticketId,
      senderId: localStorage.getItem("userId"),
      message: replyMessage,
      senderType: localStorage.getItem("userType")
    }
    const response = await post(endpoints.addReply, payload);
    toast.success(response.message)



    // Optional: close modal and reset
    setReplyMessage("");
    setShowReplyModel(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm satosi_regular">
      {/* ---------- header ---------- */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold satosi_bold">Support Tickets</h2>
          <p className="text-sm text-gray-500">
            Manage customer support tickets and inquiries
          </p>
        </div>
        {/* <button
          className="button"
          onClick={() => navigate("/admin/create_ticket")}
        >
          Create Ticket
        </button> */}
      </div>

      {/* ---------- stats cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h4 className="text-sm text-gray-600 satosi_light">
                {item.title}
              </h4>
              <p className="text-xl font-bold">{item.count}</p>
              <span className="text-xs text-red-500">↓ {item.change}</span>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full" />
          </div>
        ))}
      </div>

      {/* ---------- filters ---------- */}
      <div className="mt-6 rounded-lg border p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center border rounded px-3 py-2 w-full sm:w-64">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="outline-none w-full text-sm"
          />
        </div>

        <select
          className="border rounded px-3 py-2 text-sm"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select
          className="border rounded px-3 py-2 text-sm"
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded bg-black text-white text-sm"
          onClick={() => fetchTickets()}
        >
          <FaFilter />
          Apply Filters
        </button>
      </div>

      {/* ---------- tickets table ---------- */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Subject</th>
              <th className="p-3 font-medium">User</th>
               <th className="p-3 font-medium">Message</th>
              
              <th className="p-3 font-medium">Priority</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium">Reply</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr className="text-center text-gray-500">
                <td colSpan="7" className="py-6">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t">
                  <td className="p-3">{ticket.id}</td>
                  <td className="p-3">{ticket.subject}</td>
                  <td className="p-3">{ticket.user?.fullName}</td>
                   <td className="p-3">{ticket?.message}</td>

                  <td className="p-3 capitalize">{ticket.priority}</td>
                  <td className="p-3 capitalize">{ticket.status}</td>

                  <td className="p-3">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setShowReplyModel(true);
                        setTicketId(ticket.id);
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition-all duration-200"
                    >
                      <FiMail className="text-lg" />
                      Reply
                    </button>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        openStatusModal(ticket.id, ticket.status)
                      }
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(ticket.id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- pagination ---------- */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ---------- status update modal ---------- */}
      {statusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40" style={{ backdropFilter: "blur(10px)" }}>
          <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Update Ticket Status
            </h3>

            <select
              value={statusModal.status}
              onChange={(e) =>
                setStatusModal({ ...statusModal, status: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-6"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 mt-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveStatus}
                className="px-4 py-2 mt-2 button text-white rounded"
              >
                Update
              </button>
            </div>
          </div>

        </div>
      )}
      {showReplyModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg w-96 shadow-lg">
            <button
              onClick={() => setShowReplyModel(false)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-600"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">Reply</h3>

            <label className="block text-sm font-medium mb-1">Message</label>
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full border rounded px-2 py-1 mb-4"
            />

            <button
              onClick={handleSendReply}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send Reply
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

export default Support;
