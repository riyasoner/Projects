import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaUsers, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';



const revenueData = [
  { month: 'Jan', revenue: 100 },
  { month: 'Feb', revenue: 250 },
  { month: 'Mar', revenue: 320 },
  { month: 'Apr', revenue: 400 },
  { month: 'May', revenue: 425 },
];

const topSellers = [
  {
    name: 'My clothes shop',
    seller: 'Riya Soner',
    sales: 1,
    amount: '$425.22',
  },
];



function DashboardHome() {



  const { get } = useApi()
  const [stats, setStats] = useState(null)
  const [latestActivity, setLatestActivity] = useState([])
  const [topSeller, setTopSeller] = useState([])
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchLatestActivity();
    fetchTopSeller();
    fetchRevenue();

  }, [])

const fetchRevenue = async () => {
  try {
    const response = await get(endpoints.getMonthlyRevenue);

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      const formatted = response.data.map(item => ({
        month: item.monthName,
        revenue: parseFloat(item.totalRevenue) || 0
      }));
      setRevenueData(formatted);
    } else {
      // Fallback default data
      setRevenueData([
        { month: "Jan", revenue: 0 },
        { month: "Feb", revenue: 0 },
        { month: "Mar", revenue: 0 },
        { month: "Apr", revenue: 0 },
        { month: "May", revenue: 0 }
      ]);
    }
  } catch (error) {
    console.error("Error in fetching Revenue", error);

    // If API fails, show default data
    setRevenueData([
      { month: "Jan", revenue: 0 },
      { month: "Feb", revenue: 0 },
      { month: "Mar", revenue: 0 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 0 }
    ]);
  }
};




  const fetchStats = async () => {
    try {
      const response = await get(endpoints.getAdminDashboardStats);
      setStats(response.data || {})

    } catch (error) {
      console.log("Error in fetching Stats")

    }
  }

  const fetchLatestActivity = async () => {
    try {
      const response = await get(endpoints.getLatestActivity);
      setLatestActivity(response.data || [])

    } catch (error) {
      console.log("Error in fetching Latest Activity")

    }
  }

  const fetchTopSeller = async () => {
    try {
      const response = await get(endpoints.getTopSeller);
      setTopSeller(response.data || [])

    } catch (error) {
      console.log("Error in fetching Top Seller")

    }
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || 0,
      icon: <FaDollarSign className="text-green-500 text-2xl" />,
      change: '+100.0%',
      description: 'Platform-wide revenue',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="text-green-500 text-2xl" />,
      change: '+100.0%',
      description: 'Sellers and customers',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <FaShoppingCart className="text-green-500 text-2xl" />,
      change: '+100.0%',
      description: 'Orders across platform',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <FaBoxOpen className="text-green-500 text-2xl" />,
      change: '+100.0%',
      description: 'Active products',
    },
  ];


  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold satosi_bold">Admin Dashboard</h2>
        <span className="text-gray-500 satosi_light">
          Platform overview and key metrics
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <h3 className="text-xl font-bold">{metric.value}</h3>
                <div className="text-green-500 text-sm mt-1">
                  <span>{metric.change}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-bold mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Latest Activities */}
  <div>
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-bold mb-4">Latest Activities</h3>
      <ul className="space-y-4">
        {latestActivity.length === 0 ? (
          <div>No activity found</div>
        ) : (
          latestActivity.slice(0,5).map((activity, idx) => (
            <li key={idx} className="flex items-start justify-between">
              <div>
                <p className="font-semibold capitalize">
                  {activity.type}
                  <span className="text-xs text-purple-600 ml-2">
                    ({activity.type === "product" ? "Product Update" : "User Update"})
                  </span>
                </p>
                <p className="text-gray-600 text-sm">{activity.message}</p>
              </div>
              <span className="text-gray-400 text-xs">
                {new Date(activity.time).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  </div>

  {/* Top Sellers */}
  <div>
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-bold mb-4">Top Sellers</h3>
      <ul className="space-y-4">
        {topSeller.length === 0 ? (
          <div>Not Found</div>
        ) : (
          topSeller.map((item, idx) => (
            <li key={idx}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={`${item.seller.profileImage}`}
                    alt={item.seller.fullName}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold">{item.seller.fullName}</p>
                    <p className="text-gray-500 text-sm">{item.seller.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{item.totalEarnings}</p>
                  <p className="text-green-600 text-sm">
                    {item.totalPayments} sale{item.totalPayments > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="bg-green-100 h-2 rounded mt-2">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{
                    width: `${Math.min(100, item.totalPayments * 100)}%`,
                  }}
                ></div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
</div>


    </div>
  );
}

export default DashboardHome;
