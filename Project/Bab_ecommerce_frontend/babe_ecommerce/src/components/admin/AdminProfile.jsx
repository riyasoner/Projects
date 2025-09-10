import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";

function AdminProfile() {
  const userId = localStorage.getItem("userId");
  const { get, patch } = useApi();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await get(`${endpoints.getUserById}/${userId}`);
      setUser(response.data);
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        phoneNo: response.data.phoneNo,
      });
    } catch (error) {
      console.log("Error fetching User", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await patch(`${endpoints.updateUser}/${userId}`, formData);
      setIsModalOpen(false);
      fetchUser();
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  if (!user) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

        {/* Profile Info */}
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Full Name:</span> {user.fullName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {user.phoneNo}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${
                user.status === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user.status}
            </span>
          </p>
        </div>

        {/* Update Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Update Profile</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Phone No</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
