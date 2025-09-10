import React, { useEffect, useState } from "react";
import { FaUser, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { FaUsers, FaUserPlus, FaStore, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";


const LIMIT = 10;

function Users() {
  const { get, patch,del } = useApi();

  // ─────────── state ───────────
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [stats, setStats] = useState(null)



  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: LIMIT,

  });


  // ─────────── data fetcher ───────────
  const fetchUsers = async ({ page = 1, searchText = "", role = "All" } = {}) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", LIMIT);
      if (searchText) params.append("search", searchText.trim());
      if (role !== "All") params.append("role", role);

      const res = await get(`${endpoints.getAllUsers}?${params.toString()}`);

      setUsers(res.data || []);
      setPagination(res.pagination || { total: 0, currentPage: 1, totalPages: 1, limit: LIMIT });
    } catch (err) {
      console.error("Error fetching users ➜", err);
    }
  };

  // initial load
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await get(endpoints.getUserSummary)
      setStats(response.data || {})

    } catch (error) {
      console.log("Error in fetching stats ", error)

    }
  }

  // debounce search (300 ms)
  useEffect(() => {
    const id = setTimeout(() => fetchUsers({ page: 1, searchText: search, role: roleFilter }), 300);
    return () => clearTimeout(id);

  }, [search]);

  // refetch when role filter changes
  useEffect(() => {
    fetchUsers({ page: 1, searchText: search, role: roleFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  // page change handler
  const goToPage = (p) => {
    if (p > 0 && p <= pagination.totalPages && p !== pagination.currentPage) {
      fetchUsers({ page: p, searchText: search, role: roleFilter });
    }
  };

  const handleApproved = async (id) => {
    try {
      const response = await patch(`${endpoints.verifyUser}/${id}`, {})
      toast.success(response.message)
      fetchUsers();

    } catch (error) {
      console.log("Error in Approved User", error)
    }
  }
  const handleDelete=async(id)=>{
    try {
      const response=await del (`${endpoints.deleteUserById}/${id}`)
      toast.success(response.message);
      fetchUsers()
      
    } catch (error) {
       toast.error(error.message)
    }
  }

    const handleDeleteClick = (id) => {
      confirmAlert({
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this Users?",
        buttons: [
          {
            label: "Yes",
            onClick: () => handleDelete(id),
          },
          {
            label: "No",
          },
        ],
        overlayClassName: "custom-overlay"
      });
    };

  return (
    <div className="p-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Users",
              count: stats.totalUsers ?? 0,
              icon: <FaUsers className="text-purple" />,
            },
            {
              title: "New Users",
              count: stats.newUsers ?? 0,
              icon: <FaUserPlus className="text-purple" />,
            },
            {
              title: "Active Sellers",
              count: stats.activeSellers ?? 0,
              icon: <FaStore className="text-purple" />,
            },
            {
              title: "Verified Users",
              count: stats.verifiedUsers ?? 0,
              icon: <FaCheckCircle className="text-purple" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border p-4 shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h4 className="text-sm text-gray-600 satosi_light">{item.title}</h4>
                <p className="text-xl font-bold">{item.count}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">



        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUser className="text-purple" />
            Users
          </h2>
          <p className="text-sm text-gray-500">
            Manage all users on the platform ({pagination.total} users)
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
          <button className="border px-4 py-2 rounded-md text-sm" style={{ borderRadius: "10px" }}>
            Export
          </button>
          <button
            className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            style={{ borderRadius: "10px" }}
          >
            <FiPlus className="text-white" /> Add User
          </button>
        </div> */}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
        </div> */}
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4">Verified</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => u.userType === "user") // ✅ Only Customers
              .map((u, i) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {(pagination.currentPage - 1) * pagination.limit + i + 1}
                  </td>
                  <td className="px-4 py-3">{u.fullName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-600">
                      Customer
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className={` text-white px-4 py-1 rounded-md shadow-sm transition duration-200 ${u.isVerified ? "bg-gray-400 cursor-not-allowed" : "bg-purple"
                        }`}
                      onClick={() => handleApproved(u.id)}
                      disabled={u.isVerified} 
                      style={{borderRadius:"10px "}}
                    >
                     {u.isVerified?"Verified":"Verify"} 
                    </button>
                  </td>

                  <td className="px-4 py-3 flex gap-3">
                    <button className="text-red-600 hover:text-red-800" onClick={()=>{
                      handleDeleteClick(u.id)
                    }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

            {/* If no customers */}
            {users.filter((u) => u.userType === "user").length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="6">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4 text-sm">
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={pagination.currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: pagination.totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-1 border rounded ${pagination.currentPage === idx + 1 ? "bg-purple text-white" : ""
                }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Users;
