import { useState, useEffect } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function AssignBook() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const [assigning, setAssigning] = useState(false);

  const [permissions, setPermissions] = useState({
    read_book: true,
    create_book: false,
    update_book: false,
    delete_book: false,
  });
  const userId = localStorage.getItem("userId");
  const { get, post, patch } = useApi();
  const fetchUsers = async () => {
    try {
      const response = await get(
        `${endPoints.getAllUser}?createdByUserId=${userId}`
      );
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await get(
          `${endPoints.getAllBooks}?createdByUserId=${userId}`
        );
        setBooks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      }
    };
    fetchBooks();
    fetchUsers();
  }, []);

  const handleAssign = async () => {
    if (!selectedUserId || selectedBooks.length === 0) {
      alert("Please select a user and at least one book.");
      return;
    }

    const payload = {
      userId: Number(selectedUserId),
      bookId: selectedBooks.map(Number),
      ...permissions,
    };
    setAssigning(true);

    try {
      const response = await post(endPoints.assignBook, payload);
      if (response.status) {
        alert("Books assigned successfully!");
        setSelectedUserId("");
        setSelectedBooks([]);
      }
    } catch (error) {
      console.error("Error assigning books:", error);
      alert("Failed to assign books.");
    } finally {
      setAssigning(false);
    }
  };

  const toggleUserType = async (id, currentType) => {
    const newType = currentType === "admin" ? "user" : "admin";
    const isConfirmed = window.confirm(
      `Are you sure you want to change this ${currentType} to ${newType}?`
    );

    if (!isConfirmed) return;

    try {
      const response = await post(`${endPoints.updateUserDetails}`, {
        id,
        user_type: newType,
      });
      if (response.status) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, user_type: newType } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user type:", error);
      alert("Failed to update user type.");
    }
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map((book) => book.id));
    }
    setSelectAll(!selectAll);
  };
  const deleteUser = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!isConfirmed) return;

    try {
      const response = await post(`${endPoints.deleteUser}?id=${id}`, {});

      if (response.status) {
        alert("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };
  const handleViewTransaction = (userId) => {
    navigate(`/userTransactions/${userId}`);
  };

  const handleViewassignBook = (userId) => {
    navigate(`/userBooks/${userId}`);
  };

  const handleViewSettledTransaction = (userId) => {
    navigate(`/settledTransactions/${userId}`);
  };

  // const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    email_id: "",
    phone_no: "",
    show_password: "",
    user_type: "user",
  });

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditUser({ ...user });
  };

  const handleChange = (field, value) => {
    setEditUser((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    setEditingUserId(null);
  };

  const saveUserChanges = async () => {
    try {
      await patch(endPoints.updateUser, { editUser }); // replace with your actual API
      alert("User updated successfully");
      closeModal();
      fetchUsers(); // reload the user list
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-lg p-4">
        <h3 className="mb-4 fw-normal">
          <i className="fas fa-book me-2" style={{ color: "blue" }}></i> Assign
          Book
        </h3>
        {/* User Selection */}
        <div className="mb-3">
          <label className="form-label fw-bold">Select Admin:</label>
          <select
            className="form-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Select Admin --</option>
            {users
              .filter((user) => user.user_type === "admin")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        {/* Books Selection */}
        <div className="mb-3">
          <label className="form-label fw-bold">Select Books:</label>
          <div
            className="border p-2 rounded"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          >
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="select-all-books"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label className="form-check-label" htmlFor="select-all-books">
                Select All
              </label>
            </div>
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`book-${book.id}`}
                    value={book.id}
                    checked={selectedBooks.includes(book.id)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setSelectedBooks((prev) =>
                        prev.includes(value)
                          ? prev.filter((id) => id !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`book-${book.id}`}
                  >
                    {book.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted">No books available.</p>
            )}
          </div>
        </div>

        {/* Permissions */}
        {/* Permissions */}
        <div className="mb-3">
          <label className="form-label fw-bold">Permissions:</label>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(permissions).map((key) => {
              let displayName = "";
              if (key === "read_book") displayName = "Read Only";
              if (key === "update_book") displayName = "Edit ";
              if (key === "delete_book") displayName = "Delete";

              return displayName ? (
                <div key={key} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={key}
                    checked={permissions[key]}
                    onChange={() =>
                      setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                  />
                  <label className="form-check-label" htmlFor={key}>
                    {displayName}
                  </label>
                </div>
              ) : null; // Hide create_book
            })}
          </div>
        </div>

        {/* Assign Button */}
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAssign}
          disabled={assigning}
        >
          {assigning ? "Assigning..." : "Assign Book"}
        </button>
      </div>

      {/* User List Table */}
      <div className="mt-5">
        <h3>All Users</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone No.</th>
              <th>Email</th>
              <th>Password</th>
              <th>User Type</th>
              <th>View Transaction</th>
              <th>View Assign Book</th>
              <th>Actions</th>
              {/* <th>Settled Transaction</th> */}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((user) => user.user_type !== "super_admin") // Exclude super_admin users
                .map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.phone_no}</td>
                    <td>{user.email_id}</td>
                    <td>{user.show_password ? user.show_password : "N/A"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.user_type === "admin"
                            ? "btn-success"
                            : "btn-warning"
                        }`}
                        onClick={() => toggleUserType(user.id, user.user_type)}
                      >
                        {user.user_type}
                        {/* <i className="fas fa-edit ms-2"></i> */}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleViewTransaction(user.id)}
                      >
                        <span>View</span>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-dark btn-sm me-2"
                        onClick={() => handleViewassignBook(user.id)}
                      >
                        <i className="">view books</i>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-1"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingUserId && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUser.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editUser.email_id}
                    onChange={(e) => handleChange("email_id", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Phone No.:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUser.phone_no}
                    onChange={(e) => handleChange("phone_no", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Password:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUser.show_password}
                    onChange={(e) =>
                      handleChange("show_password", e.target.value)
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>User Type:</label>
                  <select
                    className="form-control"
                    value={editUser.user_type}
                    onChange={(e) => handleChange("user_type", e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={saveUserChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
