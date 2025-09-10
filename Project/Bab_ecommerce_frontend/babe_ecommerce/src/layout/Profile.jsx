import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTruck,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaCoins,
  FaBlog,
  FaTicketAlt,
  FaUserTie,

} from "react-icons/fa";
import {

  FaHeart,
  FaWallet,
  FaRupeeSign,
  FaCreditCard,
  FaUniversity,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";
import MyOrder from "../components/user/Order/MyOrder"

import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import CreateTicket from "../components/admin/CreateTicket";
import Wishlist from "../components/user/Wishlist/Wishlist";
import { useLocation, useNavigate } from "react-router-dom";
import Wallet from "../components/user/Wallet/Wallet";
import Coins from "../components/user/Coins/Coins";
import Blogs from "../components/user/Blog/Blogs";
import CreateBlog from "../components/user/Blog/CreateBlog";
import UpdateBlog from "../components/user/Blog/UpdateBlog";
import Coupon from "../components/user/Coupon/Coupon";
import SellerReason from "../components/user/SellerTab/SellerReason";

const Profile = () => {
  const { get, post, patch } = useApi();
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [addresEdit, setEditAddreess] = useState(null)
  const [userTickets, setUserTickets] = useState([]);
  const navigate = useNavigate()
  const { state } = useLocation();
  const Tab = state?.activeTab || "profile"
  useEffect(() => {
    setActiveTab(Tab)
  }, [Tab])

  useEffect(() => {
    if (activeTab === "customer") {
      fetchUserTickets();
    }
  }, [activeTab]);


  const fetchUserTickets = async () => {
    try {
      const res = await get(`${endpoints.getTicketsByUser}/${userId}`);
      if (res.status) {
        setUserTickets(res.data); // check API structure
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  console.log(addresEdit)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    email: "",

    profileImage: null,
  });

  const [addressForm, setAddressForm] = useState({
    userId: userId,
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    type: "home",
    isDefault: true

  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



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






  useEffect(() => {
    fetchUserById();
    fetchOrderById();
    fetchAddress()
  }, []);

  const fetchAddress = async () => {
    try {
      const response = await get(`${endpoints.getAddressesByUser}/${userId}`);
      setAddresses(response.data || []);



    } catch (error) {
      console.log("Error fetching Address by ID:", error);
    }
  };

  const fetchUserById = async () => {
    try {
      const response = await get(`${endpoints.getUserById}/${userId}`);
      if (response.status && response.data) {
        const data = response.data;
        setUser(data);
        setFormData({
          fullName: data.fullName || "",
          phoneNo: data.phoneNo || "",
          email: data.email || "",

          profileImage: data.profileImage || "",
        });
      }
    } catch (error) {
      console.log("Error fetching user by ID:", error);
    }
  };

  useEffect(() => {
    if (addresEdit) {
      setAddressForm({
        userId: userId,
        fullName: addresEdit.fullName || "",
        phoneNumber: addresEdit.phoneNumber || "",
        addressLine1: addresEdit.addressLine1 || "",
        addressLine2: addresEdit.addressLine2 || "",
        landmark: addresEdit.landmark || "",
        city: addresEdit.city || "",
        state: addresEdit.state || "",
        postalCode: addresEdit.postalCode || "",
        country: addresEdit.country || "",
        type: addresEdit.type || "home",
        isDefault: addresEdit.isDefault ?? true
      });
    } else {
      // If not editing, clear the form
      setAddressForm({
        userId: userId,
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        type: "home",
        isDefault: true
      });
    }
  }, [addresEdit]);




  const fetchOrderById = async () => {
    try {
      const response = await get(`${endpoints.getOrders}?userId=${userId}`);
      setOrder(response.data || null);
    } catch (error) {
      console.log("Error fetching order:", error);
      setOrder(null);
    }
  };


  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("phoneNo", formData.phoneNo);
      data.append("email", formData.email);


      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const response = await patch(`${endpoints.updateProfile}?userId=${userId}`, data);


      toast.success(response.message || "Profile updated successfully");
      setActiveTab("profile")

    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "An error occurred while updating profile");
    }
  };

  const handleSubmitAddress = async () => {
    try {
      if (addresEdit) {
        const response = await patch(`${endpoints.updateAddress}/${addresEdit.id}`, addressForm);
        toast.success(response.message || "Address updated successfully");
        setEditAddreess(null);
        setActiveTab("address")
      } else {
        const response = await post(endpoints.addAddress, addressForm);
        toast.success("Address added successfully");
      }

      // Reset form after success
      setAddressForm({
        userId: userId,
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        type: "home",
        isDefault: true
      });

      // Refresh address list if needed
      fetchAddress();

      // Go back to main tab
      setActiveTab("address");

    } catch (error) {
      console.log("Error", error);
      toast.error("Something went wrong!");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await del(`${endpoints.deleteAddress}/${id}`);
      toast.success(response.message)
      fetchAddress();


    } catch (error) {
      console.log("Error", error)
      toast.error(error.message)
    }

  }
  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Category?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteAddress(id),
        },
        {
          label: "No",
        },
      ],
      overlayClassName: "custom-overlay"
    });
  };




  const renderTabContent = () => {
    if (activeTab === "profile") {
      return (


        <div className="flex-1 p-6 relative">
          {/* Edit Profile Button */}
          <div className="absolute right-6 top-6">
            <button
              className="w-full sm:w-auto text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full text-[#3E4152] border border-[#3E4152] satosi-light hover:bg-[#f7f7f7] transition duration-200 shadow-sm"
              onClick={() => setActiveTab("edit")}
            >
              Edit Profile
            </button>

          </div>

          {/* Profile Image & Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-green-400 shadow-lg overflow-hidden">
              <img
                src={user?.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* <div className="flex-1 space-y-2 text-center md:text-left md:pt-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.fullName || "N/A"}
              </h2>
              <p className="text-base text-gray-700">
                <span className="font-medium text-gray-600">Email:</span> {user?.email || "example@mail.com"}
              </p>
            </div> */}

          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {/* Orders */}
            <div className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition" onClick={() => {
              setActiveTab("orders")
            }}>
              <div className="flex items-center gap-3 mb-2">
                <FaBoxOpen className="text-blue-500 text-lg" />
                <h3 className="font-semibold text-gray-800">Orders</h3>
              </div>
              <p className="text-sm text-gray-600">Check your order status</p>
            </div>

            {/* Wishlist */}
            <div className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition"
              onClick={() => {
                setActiveTab("edit")
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <FaHeart className="text-pink-500 text-lg" />
                <h3 className="font-semibold text-gray-800">Edit Profile</h3>
              </div>
              <p className="text-sm text-gray-600">Your saved items</p>
            </div>

            {/* Myntra Credit */}
            <div className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition"
              onClick={() => {
                setActiveTab("address")
              }} >
              <div className="flex items-center gap-3 mb-2">
                <FaWallet className="text-purple-500 text-lg" />
                <h3 className="font-semibold text-gray-800">Address</h3>
              </div>
              <p className="text-sm text-gray-600">Refunds & gift cards</p>
            </div>

            {/* MynCash */}
            {/* <div className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition"
             onClick={() => {
            setActiveTab("changepassword")
          }}>
              <div className="flex items-center gap-3 mb-2">
                <FaRupeeSign className="text-green-500 text-lg" />
                <h3 className="font-semibold text-gray-800">Change Password</h3>
              </div>
              <p className="text-sm text-gray-600">Earn as you shop</p>
            </div> */}

            {/* Saved Cards */}
            {/* <div className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition"
             onClick={() => {
            setActiveTab("edit")
          }}>
              <div className="flex items-center gap-3 mb-2">
                <FaCreditCard className="text-indigo-500 text-lg" />
                <h3 className="font-semibold text-gray-800">Saved Cards</h3>
              </div>
              <p className="text-sm text-gray-600">For faster checkout</p>
            </div> */}

            {/* Saved UPI */}
            {/* <div className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <FaUniversity className="text-yellow-500 text-lg" />
                <h3 className="font-semibold text-gray-800">Saved UPI</h3>
              </div>
              <p className="text-sm text-gray-600">Your UPI accounts</p>
            </div> */}
          </div>
        </div>


      );
    }

    if (activeTab === "orders") {
      if (!order || order.length === 0) {
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h2>
            <div className="bg-white shadow-md border rounded-xl p-6 text-gray-600">
              <p>You have not placed any orders yet.</p>
            </div>
          </div>
        );
      }

      return (
        // <div>
        //   <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        //   <div className="max-h-[500px] overflow-y-auto pr-2 space-y-8">
        //     {order.map((ord) => (
        //       <div
        //         key={ord.id}
        //         className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6"
        //       >
        //         <div className="space-y-2">
        //           <div className="flex items-center gap-2 text-sm text-gray-700">
        //             <FaBoxOpen className="text-blue-500" />
        //             <span className="font-semibold">Delivery Status:</span> {ord.orderStatus}
        //           </div>
        //           <div className="flex items-center gap-2 text-sm text-gray-700">
        //             <FaTruck className="text-green-500" />
        //             <span className="font-semibold">Shipping To:</span>{" "}
        //             {ord.shippingAddress?.fullName} ({ord.shippingAddress?.phoneNumber})
        //           </div>
        //         </div>

        //         <div className="bg-gray-50 border rounded-xl p-4 text-sm">
        //           <p>
        //             <strong>Address:</strong> {ord.shippingAddress?.addressLine1},{" "}
        //             {ord.shippingAddress?.addressLine2}
        //           </p>
        //           <p>
        //             <strong>City:</strong> {ord.shippingAddress?.city},{" "}
        //             {ord.shippingAddress?.state} - {ord.shippingAddress?.postalCode}
        //           </p>
        //           <p>
        //             <strong>Landmark:</strong> {ord.shippingAddress?.landmark}
        //           </p>
        //           <p>
        //             <strong>Country:</strong> {ord.shippingAddress?.country}
        //           </p>
        //         </div>

        //         {ord.items?.map((item) => {
        //           const { product, variant } = item;
        //           return (
        //             <div key={item.id} className="flex gap-4">
        //               <img
        //                 src={
        //                   variant?.variantImages?.[0]
        //                     ? `${variant.variantImages[0]}`
        //                     : "https://via.placeholder.com/150"
        //                 }
        //                 alt="Product"
        //                 className="w-28 h-28 rounded-xl object-cover border"
        //               />
        //               <div className="flex-1 space-y-1 text-sm text-gray-700">
        //                 <p><strong>Product:</strong> {product?.title}</p>
        //                 <p><strong>Brand:</strong> {product?.brand}</p>
        //                 <p>
        //                   <strong>Variant:</strong> {variant?.variantName} -{" "}
        //                   {variant?.color}, Size: {variant?.size}
        //                 </p>
        //                 <p><strong>Quantity:</strong> {item?.quantity}</p>
        //                 <p className="flex items-center">
        //                   <FaRupeeSign className="mr-1 text-green-600" />
        //                   <strong>{item?.price}</strong>
        //                 </p>
        //               </div>
        //             </div>
        //           );
        //         })}

        //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200">
        //           <div>
        //             <p><strong>Payment Method:</strong> {ord.paymentMethod?.toUpperCase()}</p>
        //             <p><strong>Payment Status:</strong> {ord.paymentStatus}</p>
        //           </div>
        //           <div>
        //             <p><strong>Shipping Fee:</strong> ₹{ord.shippingFee}</p>
        //             <p><strong>Total:</strong> ₹{ord.totalAmount}</p>
        //             <p><strong>Final Amount:</strong> ₹{ord.finalAmount}</p>
        //           </div>
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // </div>
        <MyOrder />
      );
    }


    if (activeTab === "add_address") {
      return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-2xl space-y-6">
          <h2 className="text-2xl font-bold text-gray-800  pb-2">{!addresEdit ? "Add Address" : "Update Address"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              value={addressForm.fullName}
              onChange={handleAddressChange}
              placeholder="Full Name"
              className="input-style"
            />

            <input
              type="text"
              name="phoneNumber"
              value={addressForm.phoneNumber}
              onChange={handleAddressChange}
              placeholder="Phone Number"
              className="input-style"
            />

            <input
              type="text"
              name="addressLine1"
              value={addressForm.addressLine1}
              onChange={handleAddressChange}
              placeholder="Address Line 1"
              className="input-style"
            />

            <input
              type="text"
              name="addressLine2"
              value={addressForm.addressLine2}
              onChange={handleAddressChange}
              placeholder="Address Line 2"
              className="input-style"
            />

            <input
              type="text"
              name="landmark"
              value={addressForm.landmark}
              onChange={handleAddressChange}
              placeholder="Landmark"
              className="input-style"
            />

            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="input-style"
            />

            <input
              type="text"
              name="state"
              value={addressForm.state}
              onChange={handleAddressChange}
              placeholder="State"
              className="input-style"
            />

            <input
              type="text"
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              className="input-style"
            />

            <input
              type="text"
              name="country"
              value={addressForm.country}
              onChange={handleAddressChange}
              placeholder="Country"
              className="input-style"
            />

            <select
              name="type"
              value={addressForm.type}
              onChange={handleAddressChange}
              className="input-style"
            >
              <option value="home">Home</option>
              <option value="work">Office</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isDefault"
              checked={addressForm.isDefault}
              onChange={handleAddressChange}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm text-gray-700 font-medium">Set as Default Address</label>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmitAddress}
              className="button transition-all duration-200 text-white font-semibold px-6 py-2 rounded-xl shadow-md"
            >
              {addresEdit ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      );
    }




    if (activeTab === "address") {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Address Book</h2>
            <button
              onClick={() => {
                setActiveTab("add_address")

              }} // Replace with your add address function
              className="button text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
            >
              + Add Address
            </button>
          </div>

          <div className="grid gap-4">
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <div key={index} className="bg-white shadow-md border rounded-xl p-6 relative">
                  <div className="absolute top-4 right-4 flex gap-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setActiveTab("add_address");
                        setEditAddreess(address);
                      }}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FaEdit />

                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(address.id)}
                      className="text-sm text-red-600 hover:underline flex items-center gap-1"
                    >
                      <FaTrash />

                    </button>
                  </div>

                  <p className="font-medium text-gray-800">{address.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                    {address.landmark && `, Landmark: ${address.landmark}`}
                    , {address.city}, {address.state}, {address.country}
                  </p>
                  <p className="text-sm text-gray-600">PIN: {address.postalCode}</p>
                  {address.type && (
                    <p className="text-sm text-gray-500 capitalize">Type: {address.type}</p>
                  )}
                  {address.isDefault && (
                    <span className="text-xs text-green-600 font-semibold">
                      Default Address
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No addresses found.</p>
            )}
          </div>
        </div>
      );
    }
    if (activeTab === "createTicket") {
      return <CreateTicket />
    }
    if (activeTab === "customer") {
      return (
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Your Support Tickets</h2>
            <button
              className="button text-white px-4 py-2 rounded shadow w-full sm:w-auto text-sm sm:text-base"
              onClick={() => setActiveTab("createTicket")}
            >
              + Create Ticket
            </button>
          </div>

          {userTickets.length === 0 ? (
            <p className="text-gray-500 text-md">No tickets found.</p>
          ) : (
            <div className="grid gap-5">
              {userTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-5 shadow-md bg-white transition hover:shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-blue-700">{ticket.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${ticket.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"}
                `}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 mb-3">{ticket.message}</p>

                  <div className="flex gap-3 text-xs text-gray-500 mb-2">
                    <span>
                      <strong>Priority:</strong>{" "}
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-medium ${ticket.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                          }`}
                      >
                        {ticket.priority}
                      </span>
                    </span>
                    <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Replies */}
                  {ticket.replies.length > 0 && (
                    <div className="mt-4 bg-gray-50 border-t pt-3 rounded">
                      <p className="font-medium text-sm text-gray-700 mb-2">Replies:</p>
                      {ticket.replies.map((reply, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-800 border-l-4 border-blue-400 pl-3 mb-2"
                        >
                          <span className="text-blue-600 font-semibold">➤ </span>
                          {reply.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }




    if (activeTab === "changepassword") {
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
      );
    }

    if (activeTab === "edit") {
      return (
        <div className="max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-3xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Profile</h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleEditChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleEditChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleEditChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Profile Image
            </label>

            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: file,
                    profileImagePreview: URL.createObjectURL(file), // 👈 preview for new file
                  }));
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 cursor-pointer 
               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
               file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />

            {/* Preview */}
            {(formData?.profileImagePreview || formData?.profileImage) && (
              <div className="mt-3">
                <img
                  src={
                    formData.profileImagePreview // 👈 agar nayi image upload hui hai
                      ? formData.profileImagePreview
                      : `${formData.profileImage}` // 👈 backend path
                  }
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border shadow"
                />
              </div>
            )}
          </div>



          {/* Update Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleUpdate}
              className="button transition-colors duration-200 text-white font-medium px-6 py-2 rounded-lg shadow-md"
            >
              Update
            </button>
          </div>
        </div>


      )
    }
    if (activeTab === "wishlist") {
      return <Wishlist />
    }

    if (activeTab === "wallet") {
      return <Wallet user={user} />
    }
    if (activeTab === "blogs") {
      return <Blogs />
    }
    if (activeTab === "createBlog") {
      return <CreateBlog />
    }
    if (activeTab === "editBlog") {
      return <UpdateBlog />
    }
    if (activeTab === "coupon") {
      return <Coupon />
    }
    if(activeTab==="rejection"){
      return <SellerReason/>
    }

    if (activeTab === "coin") {
      return <Coins />
    }
    if (activeTab === "logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("userId");

      navigate("/"); // or "/login" if you want to redirect to login page
      return;
    }



    return null;
  };



  const tabs = [
    { key: "profile", icon: <FaUserCircle />, label: "Overview" },
    { key: "wallet", icon: <FaWallet />, label: "My Wallet" },
    //  { key: "blogs", icon: <FaBlog />, label: "Blogs" },

    { key: "coin", icon: <FaCoins />, label: "My Coins" },
    { key: "wishlist", icon: <FaHeart />, label: "Wishlist" },
    { key: "coupon", icon: <FaTicketAlt />, label: "Coupon" },

    { key: "orders", icon: <FaBoxOpen />, label: "Orders" },



    { key: "address", icon: <FaMapMarkerAlt />, label: "Address Book" },
    { key: "changepassword", icon: <RiLockPasswordLine />, label: "Change Password" },
    { key: "customer", icon: <FaChartBar />, label: "Customer Support" },

    { key: "edit", icon: <FaUserCircle />, label: "Edit Profile" },
    {key:"rejection",icon:<FaUserTie/>,label:"Application Status"},

    { key: "logout", icon: <FaSignOutAlt />, label: "Logout", danger: true },



  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden" style={{ minHeight: '90vh' }}>

          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-gray-50 border-r p-4 md:p-6 space-y-6 overflow-y-auto md:sticky top-6 md:self-start md:h-fit">
            <div className="flex items-center gap-3">
              {/* <img src={`${user?.profileImage}`} className="w-15 h-15 rounded-full" alt="" /> */}
              <div>
                <p className="font-bold text-gray-800">
                  Hello, {user?.fullName || "User"}
                  <br />
                  <span className="text-sm font-bold text-gray-600">{user?.phoneNo || "No"}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {tabs.map((tab) => (
                <React.Fragment key={tab.key}>
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left ${activeTab === tab.key
                      ? "button text-white"
                      : tab.danger
                        ? "text-red-600 hover:bg-red-50"
                        : "hover:bg-gray-200 text-gray-800"
                      }`}
                  >
                    {tab.icon}
                    <span className="text-sm">{tab.label}</span>
                  </button>

                  {/* Optional horizontal line after specific tabs */}
                  {["profile", "orders", "changepassword", "customer"].includes(tab.key) && (
                    <hr className="border-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 p-4 md:p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>



      <Footer />
    </>
  );
};

export default Profile;
