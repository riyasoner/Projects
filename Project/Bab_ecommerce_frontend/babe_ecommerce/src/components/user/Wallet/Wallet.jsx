import React, { useState, useEffect } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { toast } from "react-toastify";
import { FaWallet, FaGift, FaClock, FaArrowDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Wallet({ user }) {
  const { post, get } = useApi();
  const [walletData, setWalletData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const userId = localStorage.getItem("userId");
  const [cashbackHistory, setCashbackHistory] = useState(null)

  // Fetch wallet balance
  const fetchWallet = async () => {
    try {
      const res = await get(`${endpoints.getUserWallet}/${userId}`);
      if (res?.data) {
        setWalletData(res.data);
      } else {
        setWalletData({});
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch wallet balance");
    }
  };

  const fetchCashbackHistory = async () => {
    try {
      const res = await get(`${endpoints.getCashbackHistory}/${userId}`);
      if (res?.data) {
        setCashbackHistory(res.data);
      } else {
        setCashbackHistory({});
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch wallet balance");
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchCashbackHistory()
  }, []);

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Add Balance
  const handleAddBalance = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      const res = await post(endpoints.addWalletBalance, { amount });

      const options = {
        key: res.key_id,
        amount: res.amount.toString(),
        currency: res.currency,
        name: "My Shop",
        description: "Add Wallet Balance",
        order_id: res.orderId,
        handler: async function (response) {
          try {
            await post(endpoints.verifyWalletPayment, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: Number(userId),
              amount: amount,
            });
            toast.success("Payment successful");
            fetchWallet();
            setIsModalOpen(false);
            setAmount("");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullName || "Customer Name",
          email: user?.email || "customer@example.com",
          contact: user?.phoneNo || "9999999999",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment failed");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Error initiating payment");
    }
  };

  const walletCards = [
    {
      label: "Real Balance",
      value: walletData.realBalance,
      color: "from-green-400 to-green-500",
      icon: <FaWallet size={28} />,
    },
    {
      label: "Promo Balance",
      value: walletData.promoBalance,
      color: "from-blue-400 to-blue-500",
      icon: <FaGift size={28} />,
    },
    // {
    //   label: "Pending Balance",
    //   value: walletData.pendingBalance,
    //   color: "from-yellow-400 to-yellow-500",
    //   icon: <FaClock size={28} />,
    // },
    // {
    //   label: "Withdrawn Amount",
    //   value: walletData.withdrawnAmount,
    //   color: "from-red-400 to-red-500",
    //   icon: <FaArrowDown size={28} />,
    // },
  ];

  return (
    <div>


      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl max-w-lg mx-auto border border-gray-100"
      >
        {/* Wallet Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaWallet className="text-indigo-600" /> My Wallet
        </h2>

        {/* Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {walletCards.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`flex flex-col items-center justify-center p-5 rounded-xl shadow-md bg-gradient-to-r ${item.color} text-white`}
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xl font-bold">
                ₹ {parseFloat(item.value || 0).toFixed(2)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Add Balance Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Top Up
        </motion.button>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Add to Wallet
                </h3>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBalance}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
                  >
                    Proceed
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      </motion.div>
      {/* Cashback History Section */}
      {cashbackHistory?.cashbackHistory?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaGift className="text-blue-500" /> Cashback 
          </h3>

          <div className="overflow-x-auto rounded-xl  ">
            <table className="min-w-full divide-y ">
              <thead className="">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Expiry Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Rule / Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y ">
                {cashbackHistory.cashbackHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {item.orderId}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-green-600">
                      ₹ {parseFloat(item.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(item.expiryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {item.cashbackRule?.name || "Cashback credited"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>

  );
}
