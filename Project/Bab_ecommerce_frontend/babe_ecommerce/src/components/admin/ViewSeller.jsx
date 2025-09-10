import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';
import {
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaStore,
    FaUser,
    FaPhone,
    FaEnvelope,
} from 'react-icons/fa';

function ViewSeller() {
    const { state } = useLocation();
    const id = state?.id;
    const { get } = useApi();
    const [seller, setSeller] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSellerById();
    }, []);

    const fetchSellerById = async () => {
        try {
            const response = await get(`${endpoints.getSellerById}/${id}`);
            setSeller(response.data || {});
        } catch (error) {
            console.log('Error for fetching seller by Id', error);
        }
    };

    if (!seller) return <div className="text-center mt-10 text-gray-600">Loading seller details...</div>;

    const {
        fullName,
        email,
        phoneNo,
        profileImage,
        userType,
        isVerified,
        isApproved,
        status,
        createdAt,
        sellerInfo,
    } = seller;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Back Button & Title */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                    <FaArrowLeft size={14} />
                    Back
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">Seller Details</h2>

            {/* Seller Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-10 transition hover:shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <img
                        src={profileImage}
                        alt={fullName}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                    />
                    <div className="space-y-2 text-gray-700 w-full">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <FaUser className="text-blue-500" /> {fullName}
                        </h2>
                        <p className="flex items-center gap-2"><FaEnvelope className="text-gray-500" /> {email}</p>
                        <p className="flex items-center gap-2"><FaPhone className="text-gray-500" /> {phoneNo}</p>
                        <p><strong>User Type:</strong> {userType}</p>
                        <p className="flex items-center gap-2">
                            <strong>Verified:</strong>{" "}
                            {isVerified ? (
                                <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> Yes</span>
                            ) : (
                                <span className="text-red-600 flex items-center gap-1"><FaTimesCircle /> No</span>
                            )}
                        </p>
                        <p><strong>Approved:</strong> {isApproved ? "Yes" : "No"}</p>
                        <p><strong>Status:</strong> {status}</p>
                        <p className="text-sm text-gray-400"><strong>Joined:</strong> {new Date(createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Store Info */}
            {sellerInfo && (
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 transition hover:shadow-2xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <FaStore className="text-indigo-500" /> Store Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                        <p><strong>Store Name:</strong> {sellerInfo.storeName}</p>
                        <p><strong>Description:</strong> {sellerInfo.storeDescription}</p>
                        <p><strong>GST Number:</strong> {sellerInfo.gstNumber}</p>
                        <p><strong>PAN Number:</strong> {sellerInfo.panNumber}</p>
                        <p><strong>Business Type:</strong> {sellerInfo.businessType}</p>
                        <p><strong>Bank Account:</strong> {sellerInfo.bankAccountNumber}</p>
                        <p><strong>IFSC Code:</strong> {sellerInfo.bankIFSC}</p>
                        <p><strong>Pickup Address:</strong> {sellerInfo.pickupAddress}</p>
                        <p><strong>Status:</strong> {sellerInfo.status}</p>
                        <p><strong>Requested At:</strong> {new Date(sellerInfo.requestedAt).toLocaleString()}</p>
                        <p><strong>Approved At:</strong> {new Date(sellerInfo.approvedAt).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewSeller;
