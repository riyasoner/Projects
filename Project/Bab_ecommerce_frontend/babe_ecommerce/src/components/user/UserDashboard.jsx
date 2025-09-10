import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHome from './UserHome'
import ProductPage from './product/ProductPage'
import CartPage from './cart/Cart'
import ProductList from './product/ProductList'
import NewArrival from './newarrival/NewArrival'
import Onsale from './onsale/Onsale'
import Checkout from './Checkout/Checkout'
import Wishlist from './Wishlist/Wishlist'
import MyOrder from './Order/MyOrder'
import Thank from './pages/Thank'
import OrderDetailsPage from './Order/OrderDetailsPage'
import Navbar from '../../layout/Navbar'
import Footer from '../../layout/Footer'
import GlobalSearch from './GlobalSearch/GlobalSearch'
import BlogDetails from './Blog/BlogDetails'
import ComingSoon from './ComingSoon/ComingSoon'
import Blogs from './Blog/Blogs'


function UserDashboard() {
  return (
    <div>
 <Navbar/>
        <Routes>
             {/* Default Route - Show Admin Home when Admin Dashboard Opens */}
            
            <Route index element={<UserHome/>}/>
            <Route path='home' element={<UserHome/>}/>
            <Route path="product_page" element={<ProductPage/>}/>
            <Route path="cart" element={<CartPage/>}/>
            <Route path="product_list" element={<ProductList/>}/>
            <Route path="new_arrival" element={<NewArrival/>}/>
            <Route path="on_sale" element={<Onsale/>}/>
            <Route path="checkout" element={<Checkout/>}/>
            <Route path="wishlist" element={<Wishlist/>}/>
            <Route path="myorder" element={<MyOrder/>}/>
            <Route path="thankyou" element={<Thank/>}/>
            <Route path="order-details/:id" element={<OrderDetailsPage />} />
             <Route path="global-search" element={<GlobalSearch />}/>
             <Route path="blogs" element={<Blogs/>}/>
             
             <Route path="blog-details" element={<BlogDetails/>}/>
              <Route path="reel-ramp" element={<ComingSoon/>}/>
             
        </Routes>
        <Footer/>
    </div>
  )
}

export default UserDashboard