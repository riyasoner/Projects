import React, { useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Routes, Route } from 'react-router-dom';

import SellerHome from './SellerHome';
import Products from './Products';
import Order from './Order';
import SellerNavbar from './SellerNavbar';
import Discount from './Discount';
import AddProduct from './AddProducts';
import ViewProducts from './ViewProducts';
import EditProducts from './EditProducts';
import EditDiscount from './EditDiscount';
import CreateDiscount from './CreateDiscount';
import PayoutRequest from './PayoutRequest';
import Inventory from './Inventory';
import AddInventory from './AddInventory';
import ChangePassword from './ChangePassword';
import ViewOrder from './ViewOrder';
import InventoryManagement from './InventoryManagement';
import AddCashbackRules from './AddCashbackRules';
import EditCashbackRules from './EditCashbackRules';
import CashbackRules from './CashbackRules';
import CoinRule from './CoinRule';
import AddCoinRule from './AddCoinRule';
import EditCoinRule from './EditCoinRule';
import OrderCustomisation from './OrderCustomisation';
import ViewCashbackRules from './ViewCashbackRules';
import Blogs from './Blogs';
import CreateBlog from './CreateBlog';
import UpdateBlog from './UpdateBlog';
import ViewBlogDetails from './ViewBlogsDetails';
import ViewCustomizeOrder from './ViewCustomizeOrder';


function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with toggle */}
      <Sidebar userType="seller" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Right Section adjusts with sidebar */}
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'
          } flex flex-col min-h-screen`}
      >
        <SellerNavbar />

        <div className="flex-1 overflow-y-auto p-4 mt-12">
          <Routes>
            <Route index element={<SellerHome />} />
            <Route path="dashboard" element={<SellerHome />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Order />} />
            <Route path="discount" element={<Discount />} />
            <Route path="add_product" element={<AddProduct />} />
            <Route path="/view_product/:id" element={<ViewProducts />} />
            <Route path="edit_product/:id" element={<EditProducts />} />
            <Route path="create_discount" element={<CreateDiscount />} />
            <Route path="edit_discount/:id" element={<EditDiscount />} />
            <Route path="payout_request" element={<PayoutRequest />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="add_inventory" element={<AddInventory />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="view_order" element={<ViewOrder />} />
            <Route path="inventory_management" element={<InventoryManagement />} />
            <Route path="cashback-rules" element={<CashbackRules />} />
            <Route path="add-cashback-rules" element={<AddCashbackRules />} />
            <Route path="edit-cashback-rule" element={<EditCashbackRules />} />

            <Route path="coin-rules" element={<CoinRule />} />
            <Route path='add-coin-rules' element={<AddCoinRule />} />
            <Route path="edit-coin-rules" element={<EditCoinRule />} />
            <Route path="orders-customize" element={<OrderCustomisation/>}/>
            <Route path="view_cashbackRule" element={<ViewCashbackRules/>}/>
            <Route path="blogs" element={<Blogs/>}/>
            <Route path="create-blog" element={<CreateBlog/>}/>
            <Route path="edit-blog" element={<UpdateBlog/>}/>
             <Route path="view-blog-details" element={<ViewBlogDetails/>}/>
             <Route path="view-customize-order" element={<ViewCustomizeOrder/>}/>


          </Routes>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
