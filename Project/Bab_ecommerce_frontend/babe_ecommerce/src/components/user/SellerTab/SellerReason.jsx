import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import EmptyApplication from "../pages/EmptyApplication";

function SellerReason() {
  const { get } = useApi();
  const userId = localStorage.getItem("userId");
  const [applicationStatus, setApplicationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReason();
  }, []);

  const fetchReason = async () => {
    try {
      const response = await get(
        `${endpoints.getSellerApplicationStatus}/${userId}`
      );
      setApplicationStatus(response.data || null);
    } catch (error) {
      console.log("Error for Fetching Reason", error);
    }
  };

  if (!applicationStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse">
          <EmptyApplication/>
        </p>
      </div>
    );
  }

  const {
    storeName,
    storeDescription,
    gstNumber,
    panNumber,
    businessType,
    bankAccountNumber,
    bankIFSC,
    pickupAddress,
    businessDocs,
    status,
    rejectionReason,
    requestedAt,
    approvedAt,
    user,
  } = applicationStatus;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-12 border border-gray-100">
      {/* Header with button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Seller Application Status
        </h2>
        <button
          onClick={() =>
            navigate("/become_seller", { state: { userId: userId } })
          }
          className="px-6 py-2 rounded-xl  button to-red-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          Update & Resubmit
        </button>
      </div>

      {/* Status */}
      <div className="mb-8 text-center">
        {status === "approved" && (
          <p className="text-green-600 font-semibold text-lg bg-green-50 px-4 py-2 rounded-lg inline-block">
            ✅ Approved on {new Date(approvedAt).toLocaleDateString()}
          </p>
        )}
        {status === "pending" && (
          <p className="text-yellow-600 font-semibold text-lg bg-yellow-50 px-4 py-2 rounded-lg inline-block">
            ⏳ Pending since {new Date(requestedAt).toLocaleDateString()}
          </p>
        )}
        {status === "rejected" && (
          <div className="space-y-2">
            <p className="text-red-600 font-semibold text-lg bg-red-50 px-4 py-2 rounded-lg inline-block">
              {/* <MdCancel/> */}
               Rejected
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Reason:</span>{" "}
              {rejectionReason || "No reason provided by admin."}
            </p>
          </div>
        )}
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-gray-50 rounded-xl border hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">
            👤 User Info
          </h3>
          <p><span className="font-medium">Name:</span> {user?.fullName}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Phone:</span> {user?.phoneNo}</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">
            🏬 Store Info
          </h3>
          <p><span className="font-medium">Store Name:</span> {storeName}</p>
          <p><span className="font-medium">Description:</span> {storeDescription}</p>
          <p><span className="font-medium">Business Type:</span> {businessType}</p>
          <p><span className="font-medium">Pickup Address:</span> {pickupAddress}</p>
        </div>
      </div>

      {/* Business Details + Docs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-gray-50 rounded-xl border hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">
            💼 Business Details
          </h3>
          <p><span className="font-medium">GST:</span> {gstNumber || "N/A"}</p>
          <p><span className="font-medium">PAN:</span> {panNumber}</p>
          <p><span className="font-medium">Bank Acc No:</span> {bankAccountNumber}</p>
          <p><span className="font-medium">Bank IFSC:</span> {bankIFSC}</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">
            📑 Business Documents
          </h3>
          {businessDocs && businessDocs.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {businessDocs.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-105 transition"
                >
                  <img
                    src={doc}
                    alt="Business Doc"
                    className="w-28 h-28 object-cover rounded-lg shadow border"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No documents uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerReason;
