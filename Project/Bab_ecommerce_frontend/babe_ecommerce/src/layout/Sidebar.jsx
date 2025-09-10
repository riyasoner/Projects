import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaThList,
  FaUsers,
  FaChartBar,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaUserShield,
  FaPercent,
  FaSatellite,
  FaTruck,
  FaMoneyBill,
  FaMoneyCheckAlt,
  FaQuestionCircle,
  FaComments,
  FaStar,
  FaCashRegister,
  FaBlog,
  FaPaperPlane,
  FaSpeakerDeck,
  FaSoundcloud,
  FaRupeeSign,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Sidebar = ({ userType, isOpen, setIsOpen }) => {
  const navigate = useNavigate()


  const location = useLocation();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");

    toast.success("Logged out successfully!");
    // setDropdownOpen(false);

    setTimeout(() => {
      navigate("/");
    }, 1500)


  };

  const adminOverview = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admin/dashboard" },

  ];
  const adminSupport = [
    { name: "Support", icon: <FaChartBar />, path: "/admin/support" },
  ]
  const adminLogin = [
    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      onClick: handleLogout, // ✅ use onClick
    },
  ]

  const adminManagement = [
    { name: "Products", icon: <FaBoxOpen />, path: "/admin/products" },
    { name: "Categories", icon: <FaThList />, path: "/admin/categories" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/admin/orders" },
    { name: "Customize Orders ", icon: <FaShoppingCart />, path: "/admin/orders-customize" },

    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Seller", icon: <FaUsers />, path: "/admin/seller" },
    { name: "Shipping", icon: <FaTruck />, path: "/admin/shipping" },
    { name: "Platform Charges", icon: <FaMoneyBill />, path: "/admin/platform_charges" },
    { name: "Payout Request", icon: <FaMoneyCheckAlt />, path: "/admin/payout_request" },
    { name: "Blogs", icon: <FaBlog />, path: "/admin/blogs" },
    //  { name: "Inventory Control", icon: <FaMoneyCheckAlt />, path: "/admin/inventory" },
    { name: "FAQ", icon: <FaQuestionCircle />, path: "/admin/faq" },


    { name: "Discount", icon: <FaPercent />, path: "/admin/discount" },
    { name: "Customer Ratings", icon: <FaStar />, path: "/admin/customer_rating" },
    { name: "Contact Us", icon: <FaComments />, path: "/admin/contact" },
    { name: "Cashback Rules", icon: <FaCashRegister />, path: "/admin/cashback-rules" },
    { name: "Coin Rules", icon: <FaCashRegister />, path: "/admin/coin-rules" },
    { name: "Banner", icon: <FaPaperPlane />, path: "/admin/banner" },
    { name: "Announcement", icon: <FaSoundcloud />, path: "/admin/announcement" },
    { name: "Refund Setting", icon: <FaRupeeSign />, path: "/admin/refund-setting" },


    // {
    //   name: "Logout",
    //   icon: <FaSignOutAlt />,
    //   onClick: handleLogout, // ✅ use onClick
    // },
  ];

  const sellerMain = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/seller/dashboard" },
  ];

  const sellerStore = [
    { name: "Products", icon: <FaBoxOpen />, path: "/seller/products" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/seller/orders" },
    { name: "Customize Orders ", icon: <FaShoppingCart />, path: "/seller/orders-customize" },
    { name: "Discount", icon: <FaPercent />, path: "/seller/discount" },
    { name: "Blogs", icon: <FaBlog />, path: "/seller/blogs" },
    { name: "Payout Request", icon: <FaMoneyCheckAlt />, path: "/seller/payout_request" },
    { name: "Inventory Control", icon: <FaMoneyCheckAlt />, path: "/seller/inventory_management" },
    // { name: "Cashback Rules", icon: <FaCashRegister />, path: "/seller/cashback-rules" },
    { name: "Coin Rules", icon: <FaCashRegister />, path: "/seller/coin-rules" },



    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      onClick: handleLogout, // ✅ use onClick
    },
  ];

  const renderSection = (title, items) => (
    <>
      {isOpen && <p className="px-4 pt-4 pb-1 text-sm font-semibold text-gray-400">{title}</p>}
      {items.map((item, idx) => {
        const isActive = location.pathname === item.path;


        if (item.onClick) {
          // ✅ Render button for logout
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className={`flex w-full items-center gap-4 px-4 py-3 mx-2 rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-100`}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </button>
          );
        }
        return (

          <Link
            key={idx}
            to={item.path}
            style={{ textDecoration: "none" }}
            className={`flex items-center gap-4 text-gray px-4 py-3 mx-2 rounded-md transition-all duration-200 ${isActive ? "bg-purple text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
          </Link>
        );
      })}
    </>
  );

  return (
    <div
      className={`${isOpen ? "w-64" : "w-16"
        } h-screen fixed top-0 left-0 bg-white shadow-md z-60 transition-all duration-300 flex flex-col `}
    >
      {/* === Top Bar === */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm bg-white">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-purple rounded-md">
              <FaUserShield className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {userType === "admin" ? "Admin" : "Seller"}
            </h2>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white bg-purple p-2 hover:text-purple-700 text-xl transition rounded"
        >
          <FaBars />
        </button>
      </div>

      {/* === Menu Sections === */}
      <nav className="flex-1 overflow-y-auto">
        {userType === "admin" ? (
          <>
            {renderSection("Overview", adminOverview)}
            {renderSection("Management", adminManagement)}
            {renderSection("Support", adminSupport)}
            {renderSection("Logout", adminLogin)}

          </>
        ) : (
          <>
            {renderSection("Main Menu", sellerMain)}
            {renderSection("Store", sellerStore)}
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
