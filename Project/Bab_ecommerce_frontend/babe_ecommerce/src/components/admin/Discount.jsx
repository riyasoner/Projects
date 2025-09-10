import React, { useEffect, useState } from 'react';
import { FaTags, FaDollarSign, FaPercent, FaUserFriends, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

const discountStats = [
  {
    title: 'Active Discounts',
    value: 0,
    change: '+0.0%',
    icon: <FaTags className="text-green-500 text-2xl" />,
  },
  {
    title: 'Revenue Impact',
    value: '$0',
    change: '+0.0%',
    icon: <FaDollarSign className="text-green-500 text-2xl" />,
  },
  {
    title: 'Avg. Discount',
    value: '0.0%',
    change: '+0.0%',
    icon: <FaPercent className="text-green-500 text-2xl" />,
  },
  {
    title: 'Discount Usage',
    value: 0,
    change: '+0.0%',
    icon: <FaUserFriends className="text-green-500 text-2xl" />,
  },
];

function Discount() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("")
  const { get, del, patch } = useApi();
  const [discounts, setDiscounts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchDiscounts(pagination.currentPage);
  }, [pagination.currentPage, status]);

  const fetchDiscounts = async (page = 1) => {
    try {
      const response = await get(`${endpoints.getAllCoupons}?status=${status}&page=${page}`);
      setDiscounts(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.log('Error in fetching Discount', error);
    }
  };

  const handleDelete = async (id) => {

    try {
      const res = await del(`${endpoints.deleteCoupon}/${id}`);
      toast.success(res.message || 'Discount deleted');
      fetchDiscounts(pagination.currentPage);
    } catch (err) {
      toast.error('Failed to delete discount');
    }

  };
  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Discount?",
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
      <div className="mb-6 flex items-center justify-between satosi_regular">
        <div>
          <h2 className="text-2xl font-bold satosi_bold">Discounts</h2>
          <span className="text-gray-500 text-sm">Manage your promotional discounts ( active discounts )</span>

        </div>

        <button
          className="bg-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all text-sm"
          style={{ borderRadius: '10px' }}
          onClick={() => navigate('/admin/create_discount')}
        >
          Create New Discount
        </button>

      </div>

      {/* Top Stat Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {discountStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 shadow-md rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-lg font-bold">{stat.value}</h3>
              <p className="text-xs text-green-500">{stat.change}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">{stat.icon}</div>
          </div>
        ))}
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold">All Discounts</h3>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-purple-500"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-gray-600 text-left border-b">
              <tr>
                <th className="py-2 px-3">Code</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Value</th>
                <th className="py-2 px-3">Min Order</th>
                <th className="py-2 px-3">Max Discount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Usage</th>
                <th className="py-2 px-3">Dates</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 ? (
                <tr className="border-t">
                  <td className="py-2 px-3 text-gray-500">No Discounts Found</td>
                  <td colSpan={8}></td>
                </tr>
              ) : (
                discounts.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3">{item.code}</td>
                    <td className="py-2 px-3 capitalize">{item.discountType}</td>
                    <td className="py-2 px-3">
                      {item.discountType === 'percent' ? `${item.discountValue}%` : `₹${item.discountValue}`}
                    </td>
                    <td className="py-2 px-3">₹{item.minOrderValue}</td>
                    <td className="py-2 px-3">₹{item.maxDiscount}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded text-xs cursor-pointer ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        onClick={() => toggleStatus(item.id, item.status)}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">{item.usageLimit} / {item.usagePerUser}</td>
                    <td className="py-2 px-3">
                      {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 flex gap-2">
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/admin/edit_discount/${item.id}`)} />
                      <FaTrashAlt className="text-red-500 cursor-pointer" onClick={() => handleDeleteClick(item.id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-end mt-4 space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: i + 1 }))}
                className={`px-3 py-1 rounded border ${pagination.currentPage === i + 1 ? 'bg-purple text-white' : 'bg-white text-gray-700'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Discount;
