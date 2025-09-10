import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { FaCoins } from "react-icons/fa";
import { motion } from "framer-motion";

function Coins() {
  const { get } = useApi();
  const [coins, setCoins] = useState({ balance: 0, userId: null });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCoinData();
  }, []);

  const fetchCoinData = async () => {
    try {
      const response = await get(
        `${endpoints.getCoinBalanceByUserId}/${userId}`
      );
      setCoins(response.data || { balance: 0, userId });
    } catch (error) {
      console.log("Error fetching Coin by UserId", error);
      setCoins({ balance: 0, userId });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[280px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
      className="relative bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-purple-900/90 backdrop-blur-xl text-white rounded-3xl shadow-xl p-7 w-full max-w-sm overflow-hidden"

      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent blur-3xl"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-lg font-semibold tracking-wide text-gray-200">
            My Coins
          </h2>
          <div className="bg-yellow-400/20 p-3 rounded-full shadow-md">
            <FaCoins className="text-yellow-400 text-2xl" />
          </div>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#800080]/10 backdrop-blur-xl p-6 rounded-2xl shadow-inner relative z-10"
        >
          <span className="text-sm text-gray-300">Available Balance</span>
          <motion.div
            key={coins.balance}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-3 text-4xl font-bold text-yellow-400 flex items-center gap-2"
          >
            {coins.balance}
            <FaCoins className="text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Shine Effect Overlay */}
        <div className="absolute top-0 left-[-60%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 animate-[shine_4s_infinite]" />
      </motion.div>

      {/* Shine Animation */}
      <style>{`
        @keyframes shine {
          0% { left: -60%; }
          100% { left: 120%; }
        }
      `}</style>
    </div>
  );
}

export default Coins;
