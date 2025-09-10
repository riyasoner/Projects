import React, { useEffect, useState } from 'react';
import { FaSearch, FaStar, FaCheckCircle, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { confirmAlert } from 'react-confirm-alert';

function Seller() {
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionType, setActionType] = useState('');
  const navigate = useNavigate()
  const [message, setMessage] = useState('');



  const { get, patch, del } = useApi();

  useEffect(() => {
    fetchSellers();
    fetchStats();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await get(endpoints.getAllSellers);
      setSellers(response.data || []);
    } catch (error) {
      console.log('Error in fetch Seller', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await get(endpoints.getSellerSummary);
      setStats(response.data || {});
    } catch (error) {
      console.log('Error in fetch Seller Summary', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedSeller || !actionType) return;

    try {
      const payload = {
        status: actionType,
      };

      if (actionType === "rejected") {
        if (!message.trim()) {
          toast.error("Please enter a rejection reason.");
          return;
        }
       payload.rejectionReason = message.trim();
      }

      const response = await patch(
        `${endpoints.approveSeller}/${selectedSeller.sellerInfo.id}`,
        payload
      );

      if (response?.success || response?.status) {
        toast.success(`Seller ${actionType} successfully`);
        fetchSellers(); // refresh list
      } else {
        toast.error("Status update failed");
      }
    } catch (error) {
      toast.error("Error updating status");
    }

    // Reset modal state
    setShowModal(false);
    setSelectedSeller(null);
    setActionType("");
    setMessage(""); // clear message input
  };


  const sellerStats = [
    {
      title: 'Total Sellers',
      value: stats?.totalSellers || 0,

      icon: <FaCheckCircle />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    {
      title: 'Active Sellers',
      value: stats?.activeSellers || 0,

      icon: <FaCheckCircle />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,

      icon: <FaStar />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
  ];
  const exportToExcel = () => {
    if (!sellers || sellers.length === 0) {
      toast.error("No data to export");
      return;
    }

    const worksheetData = sellers.map((seller, index) => ({
      "S.No": index + 1,
      "Seller Name": seller.fullName,
      "Email": seller.email,
      "Products": seller.productCount || 0,
      "Revenue": parseFloat(seller.totalRevenue || 0).toFixed(2),
      "Status": seller?.sellerInfo?.status || "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sellers");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "sellers_list.xlsx");
  };
  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteSellerById}/${id}`)
      toast.success(response.message);
      fetchSellers()

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Seller?",
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
    <div className="p-6 bg-white rounded-lg shadow-sm satosi_regular">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold satosi_bold">Sellers</h2>
          <p className="text-sm text-gray-500">
            Manage platform sellers ({sellers.length} sellers)
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={exportToExcel}
          style={{borderRadius:"10px"}}
        >
         <FaDownload /> Export
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {sellerStats.map((stat, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h4 className="text-sm text-gray-600 satosi_light">{stat.title}</h4>
              <p className="text-xl font-bold">{stat.value}</p>
              <span className={`text-xs ${stat.text}`}>{stat.change}</span>
            </div>
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${stat.bg}`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Sellers Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border text-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-medium">Seller</th>
              <th className="p-3 font-medium">Products</th>
              <th className="p-3 font-medium">Revenue</th>
              <th className="p-3 font-medium">Store</th>
              {/* <th className="p-3 font-medium">Joined</th> */}
              <th className="p-3 font-medium">Status</th>

              {/* <th className='p-3 font-medium'>Status</th> */}
              <th className="p-3 font-medium">Action</th>
              <th>view</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sellers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No sellers found.
                </td>
              </tr>
            ) : (
              sellers.map((seller) => (
                <tr key={seller.id} className="border-t">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                      {seller.fullName?.charAt(0).toUpperCase() || 'U'}

                    </div>
                    {seller.fullName}'s Store
                    <span>{seller?.email}</span>
                  </td>
                  <td className="p-3">{seller.productCount || 0}</td>
                  <td className="p-3">
                    ₹{parseFloat(seller.totalRevenue || 0).toFixed(2)}
                  </td>
                  <td className="p-3">{seller.fullName}'s Store</td>
                  {/* <td className="p-3">6 days ago</td> */}
                  <td className='p-3'>{seller?.sellerInfo?.status}</td>
                  {/* <td className='p-3'>{seller}</td> */}
                  <td className="p-3 flex gap-2">
                    {seller?.sellerInfo?.status === "pending"  || seller?.sellerInfo?.status === "rejected" ? (
                      <button
                        className="bg-green-100 text-green-700 px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedSeller(seller);
                          setActionType("approved");
                          setShowModal(true);
                        }}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        className="bg-red-100 text-red-700 px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedSeller(seller);
                          setActionType("rejected");
                          setShowModal(true);
                        }}
                      >
                        Reject
                      </button>
                    )}
                  </td>

                  <td className='p-3 '>
                    <button onClick={() => {
                      navigate("/admin/view_seller", { state: { id: seller.id } })
                    }}>
                      <FaEye size={15} />
                    </button>
                  </td>
                  <td className='p-3'>  <button className="text-red-600 hover:text-red-800" onClick={() => {
                    handleDeleteClick(seller.id)
                  }}>
                    <FaTrash />
                  </button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Confirm {actionType === "approved" ? "Approval" : "Rejection"}
            </h3>
            <p className="mb-4">
              Are you sure you want to <strong>{actionType}</strong> seller{" "}
              <strong>{selectedSeller?.fullName}</strong>?
            </p>

            {/* Input message only for rejection */}
            {actionType === "rejected" && (
              <input
                type="text"
                placeholder="Enter a reason for rejection"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${actionType === "approved" ? "bg-green-600" : "bg-red-600"
                  }`}
                onClick={handleStatusUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Seller;
