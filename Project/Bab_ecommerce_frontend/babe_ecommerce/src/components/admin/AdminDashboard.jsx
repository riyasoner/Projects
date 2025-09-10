import React, { useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Routes, Route } from 'react-router-dom';

import DashboardHome from './DashboardHome';
import Products from './Products';
import Orders from './Orders';
import Users from './Users';
import Categories from './Categories';
import AdminNavbar from './AdminNavbar';
import Support from './Support';
import Seller from './Seller';
import AddCategory from './AddCategory';
import AddSubCategories from './AddSubCategories';
import AddProducts from './AddProducts';
import ViewProducts from './ViewProducts';
import EditProducts from './EditProducts';
import Discount from './Discount';
import CreateDiscount from './CreateDiscount';
import EditDiscount from './EditDiscount';
import CreateTicket from './CreateTicket';
import Shipping from './Shipping';
import AddShipping from './AddShipping';
import EditShipping from './EditShipping';
import PlateformCharges from './PlateformCharges';
import AddPlateformFee from './AddPlateformFee';
import EditPlatformFee from './EditPlatformFee';
import PayoutRequest from './PayoutRequest';
import Faq from './Faq';
import AddFaq from './AddFaq';
import EditFaq from './EditFaq';
import Contact from './Contact';
import ViewSeller from './ViewSeller';
import ViewOrder from './ViewOrder';
import ChangePassword from './ChangePassword';
import CustomerRating from './CustomerRating';
import CreatingRating from './CreatingRating';
import AddSubSubCategory from './AddSubSubCategory';
import CashbackRules from './CashbackRules';
import AddCashbackRules from './AddCashbackRules';
import EditCashbackRules from './EditCashbackRules';
import CoinRule from './CoinRule';
import AddCoinRule from './AddCoinRule';
import EditCoinRule from './EditCoinRule';
import OrderCustomisation from './OrderCustomisation';
import ViewCashbackRules from './ViewCashbackRules';
import Blogs from './Blogs';
import ViewBlogsDetails from './ViewBlogsDetails';
import Banner from './Banner';
import AddBanner from './AddBanner';
import EditBanner from './EditBanner';
import AddAnnouncement from './AddAnnouncement';
import EditAnnouncement from './EditAnnouncement';
import Announcement from './Announcement';
import RefundSetting from './RefundSetting';
import AdminProfile from './AdminProfile';
import ViewCustomizeOrder from './ViewCustomizeOrder';

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar Fixed */}
      <Sidebar userType="admin" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'
          } flex flex-col min-h-screen `}
      >
        <AdminNavbar />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 mt-12">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="support" element={<Support />} />
            <Route path="seller" element={<Seller />} />
            <Route path="add_category" element={<AddCategory />} />
            <Route path="add_sub_category" element={<AddSubCategories />} />
            <Route path="add_product" element={<AddProducts />} />
            <Route path="view_product/:id" element={<ViewProducts />} />
            <Route path="edit_product/:id" element={<EditProducts />} />
            <Route path="discount" element={<Discount />} />
            <Route path="create_discount" element={<CreateDiscount />} />
            <Route path="edit_discount/:id" element={<EditDiscount />} />
            <Route path="create_ticket" element={<CreateTicket />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="create_shipping" element={<AddShipping />} />
            <Route path="edit_shipping" element={<EditShipping />} />
            <Route path="platform_charges" element={<PlateformCharges />} />
            <Route path="add_platform_fee" element={<AddPlateformFee />} />
            <Route path="edit_platform_fee" element={<EditPlatformFee />} />
            <Route path="payout_request" element={<PayoutRequest />} />
            <Route path="faq" element={<Faq />} />
            <Route path="add_faq" element={<AddFaq />} />
            <Route path="edit_faq" element={<EditFaq />} />
            <Route path="contact" element={<Contact />} />
            <Route path="view_seller" element={<ViewSeller />} />
            <Route path="view_order" element={<ViewOrder />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="customer_rating" element={<CustomerRating />} />
            <Route path="create_rating" element={<CreatingRating />} />
            <Route path="add_sub_subcategory" element={<AddSubSubCategory />} />
            <Route path="cashback-rules" element={<CashbackRules />} />
            <Route path="add-cashback-rules" element={<AddCashbackRules />} />
            <Route path="edit-cashback-rule" element={<EditCashbackRules />} />
            <Route path="coin-rules" element={<CoinRule />} />
            <Route path='add-coin-rules' element={<AddCoinRule />} />
            <Route path="edit-coin-rules" element={<EditCoinRule />} />
            <Route path="orders-customize" element={<OrderCustomisation />} />
            <Route path="view_cashbackRule" element={<ViewCashbackRules/>}/>
            <Route path="blogs" element={<Blogs/>}/>
            <Route path="view-blog-details" element={<ViewBlogsDetails/>}/>
            <Route path="banner" element={<Banner/>}/>
            <Route path="add_banner" element={<AddBanner/>}/>
             <Route path="edit_banner" element={<EditBanner/>}/>
             <Route path="announcement" element={<Announcement/>}/>
             <Route path="add_announcement" element={<AddAnnouncement/>}/>
             <Route path="edit_announcement" element={<EditAnnouncement/>}/>
             <Route path="refund-setting" element={<RefundSetting/>}/>

              <Route path="profile" element={<AdminProfile/>}/>
              <Route path="view-customize-order" element={<ViewCustomizeOrder/>}/>
              


          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
