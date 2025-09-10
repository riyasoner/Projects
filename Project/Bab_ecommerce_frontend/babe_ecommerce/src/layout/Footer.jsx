import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate=useNavigate()
    const userId=localStorage.getItem("userId")
    const userType=localStorage.getItem("userType")
    return (
        <footer className="bg-white text-black px-6 lg:px-20 pt-12 pb-6">
            {/* Footer Main Content */}
            <div className="flex flex-col md:flex-row justify-between gap-10 text-sm">
                {/* Brand Info */}
                <div className="md:w-1/4">
                    <h2 className="text-lg nav-text ">Bab</h2>
                    {/* <img src="/image.png" alt="" className="w-50 h-50" /> */}
                    <p className="text-gray-800 mt-3">
                        We use clothes to express your style and which you’re proud to wear. From women to men.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-6 text-xl  text-gray-600">
                        <a href="#" aria-label="Facebook ">
                            <i className="fab fa-facebook text-black"></i>
                        </a>
                        {/* <a href="#" aria-label="Twitter">
                            <i className="fab fa-twitter text-black"></i>
                        </a> */}
                        <a href="#" aria-label="Instagram">
                            <i className="fab fa-instagram text-black"></i>
                        </a>
                        {/* <a href="#" aria-label="LinkedIn">
                            <i className="fab fa-linkedin text-black"></i>
                        </a> */}
                    </div>

                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-16 w-full md:w-3/4 ">
                    <div>
                        <h4 className=" mb-4 ">Company</h4>
                        <ul className="space-y-3 text-gray-800 p-0  ">
                            <li className="nav-text footer-text" onClick={()=>{
                                navigate("/on_sale")
                            }}   >Top Selling</li>
                            <li className="nav-text footer-text"  onClick={()=>{
                                navigate("/new_arrival")
                            }}>New Arrival</li>
                             <li className="nav-text footer-text"  onClick={()=>{
                                navigate("/product_list")
                            }}>Brands</li>
                            {/* <li>Works</li>
                            <li>Career</li> */}
                            <li  className="nav-text cursor-pointer footer-text"
                            onClick={() => {
                            if (userType === "user") {
                              navigate("/become_seller",{state:{userId:userId}});
                            
                            } else {
                              
                              navigate("/seller-login");
                            }
                          }
                        }
                                >  Become a Seller</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className=" mb-4 ">Help</h4>
                        <ul className="space-y-3  text-gray-800 p-0  ">
                            <li className="nav-text footer-text">Customer Support</li>
                            <li className="nav-text footer-text">Delivery Details</li>
                            <li className="nav-text footer-text">Terms & Conditions</li>
                            <li className="nav-text footer-text">Privacy Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className=" mb-4  ">Faq</h4>
                        <ul className="space-y-3 text-gray-800 p-0  ">
                            <li className="nav-text footer-text">Account</li>
                            <li className="nav-text footer-text">Manage Deliveries</li>
                            <li className="nav-text footer-text">Orders</li>
                            <li className="nav-text footer-text">Payment</li>
                        </ul>
                    </div>
                    {/* <div>
                        <h4 className=" mb-4 ">RESOURCES</h4>
                        <ul className="space-y-2 text-gray-800  p-0 ">
                            <li className="nav-text footer-text">Free eBooks</li>
                            <li className="nav-text footer-text">Development Tutorial</li>
                            <li className="nav-text footer-text">How-to Blog</li>
                            <li className="nav-text footer-text">YouTube Playlist</li>
                        </ul>
                    </div> */}
                </div>

            </div>

            {/* Footer Bottom */}
            <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-center items-center text-gray-800 text-sm gap-4">
                <p className="text-center">Bab © 2000–2025. All Rights Reserved</p>
               
            </div>
        </footer>

    );
};

export default Footer;
