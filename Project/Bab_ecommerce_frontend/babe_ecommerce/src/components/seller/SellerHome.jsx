import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaUsers, FaShoppingCart } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import endpoints from '../../api/endpoints';
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';


const revenueData = [
  { month: 'Jan', revenue: 100 },
  { month: 'Feb', revenue: 250 },
  { month: 'Mar', revenue: 320 },
  { month: 'Apr', revenue: 400 },
  { month: 'May', revenue: 425 },
];

function SellerHome() {

  const { get } = useApi()
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null)
  const [recentOrder, setRecentOrder] = useState([])
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()
  useEffect(() => {
    fetchStats();
    fetchRevenue();
    fetchInventorySummary()
    fetchRecentOrder()

  }, [])
  const fetchRevenue = async () => {
    try {
      const response = await get(`${endpoints.getSellerMonthlyRevenue}?sellerId=${userId}`);

      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        const formatted = response.data.map(item => ({
          month: item.month,
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

  const fetchInventorySummary = async () => {
    try {

      const response = await get(`${endpoints.getInventorySummary}?sellerId=${userId}`)
      setInventorySummary(response.data || {})

    } catch (error) {
      console.log("Error for fetching Inventory", error)
    }
  }

  const fetchRecentOrder = async () => {
    try {

      const response = await get(`${endpoints.getRecentOrders}?sellerId=${userId}`)
      setRecentOrder(response.data || {})

    } catch (error) {
      console.log("Error for fetching Inventory", error)
    }
  }


  const fetchStats = async () => {
    try {
      const response = await get(`${endpoints.getSellerDashboard}?sellerId=${userId}`);
      setStats(response.data || {})

    } catch (error) {
      console.log("Error in fetching Stats")

    }
  }


  const metrics = [
    {
      title: 'Total Revenue',
      value: stats?.totalSales ? `₹${stats.totalSales}` : '₹0.00',
      icon: <FaDollarSign className="text-green-500 text-2xl" />,
      change: '+0%',
      description: 'Total sales generated',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: <FaShoppingCart className="text-green-500 text-2xl" />,
      change: '+0%',
      description: 'Orders placed',
    },
    {
      title: 'Total Discount',
      value: stats?.totalDiscounts || 0,
      icon: <FaUsers className="text-green-500 text-2xl" />,
      change: '+0%',
      description: 'Conversion percentage',
    },
    {
      title: 'Avg. Order Value',
      value: stats?.averageOrderValue ? `₹${stats.averageOrderValue}` : '₹0.00',
      icon: <FaDollarSign className="text-green-500 text-2xl" />,
      change: '+0%',
      description: 'Average value per order',
    },
  ];



  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold satosi_bold">Welcome Back</h2>
        <span className="text-gray-500 satosi_light">
          Platform overview and key metrics
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 satosi_regular">{metric.title}</p>
                <h3 className="text-xl font-bold satosi_bold">{metric.value}</h3>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  {/* <span>{metric.change}</span> */}
                </div>
                <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
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

      {/* Recent Orders, Inventory Status, Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Recent Orders */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h4 className="text-md font-bold mb-2">Recent Orders</h4>
          <p className="text-sm text-gray-500 mb-3">Manage your most recent customer orders</p>

          {recentOrder?.length === 0 ? (
            <p className="text-sm text-gray-400">No recent orders found.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {recentOrder.slice(0, 5).map((order) => (
                <li key={order.id} className="border border-gray-100 rounded p-2">
                  <div className="text-sm font-semibold">{order.product.title}</div>
                  <div className="text-xs text-gray-500">
                    Buyer: {order.order.user.fullName} • Status: <span className="capitalize">{order.order.orderStatus}</span> • Payment: {order.order.paymentStatus}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            className="mt-4 text-purple font-medium hover:underline"
            onClick={() => {
              navigate("/seller/orders");
            }}
          >
            View All
          </button>
        </div>

        {/* Inventory Status */}
        {/* <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h4 className="text-md font-bold mb-2">Inventory Status</h4>
          <p className="text-sm text-gray-500">Current stock levels by category</p>
        </div> */}

        {/* Inventory Summary */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h4 className="text-md font-bold mb-2">Inventory Summary</h4>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Total Products</span>
            <span>{inventorySummary?.totalProducts || 0}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Total Quantity</span>
            <span>{inventorySummary?.totalQuantity || 0}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Total Variants</span>
            <span>{inventorySummary?.totalVariants || 0}</span>
          </div>
          <div className="flex justify-between text-sm text-red-500 mt-1 mb-1">
            <span>Low Stock Items</span>
            <span>{inventorySummary?.lowStockCount || 0}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SellerHome;
