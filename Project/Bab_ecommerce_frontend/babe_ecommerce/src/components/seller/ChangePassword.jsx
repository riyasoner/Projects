import React, { useState } from 'react'
import useApi from '../../hooks/useApi'
import endpoints from '../../api/endpoints';

function ChangePassword() {
    const {post}=useApi();
    const userId=localStorage.getItem("userId")
     


 
   const [form, setForm] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    })

      const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })


  }


      const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.confirmPassword !== form.newPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    const payload = {
      newPassword: form.newPassword,
      oldPassword: form.oldPassword
    }

    try {
      const response = await post(`${endpoints.changePassword}?userId=${userId}`, payload)
      toast.success(response.message || "Change Password Successfully")
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setActiveTab("profile")


    } catch (error) {
      console.log("Error", error)
      toast.error(error.message)

    }
  }
  return (
   <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Change Password</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Old Password */}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter old password"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 button text-white font-medium py-2 rounded-lg transition duration-300"
            >
              Change Password
            </button>
          </form>
        </div>
  )
}

export default ChangePassword