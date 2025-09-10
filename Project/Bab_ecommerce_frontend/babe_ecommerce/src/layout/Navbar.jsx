import React, { useState, useRef, useEffect } from "react";
import {
  FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes,
  FaHeart, FaSignInAlt, FaBoxOpen,
  FaRegHeart,
  FaRegUser,
  FaEdit,
  FaWallet,
  FaTicketAlt,
  FaUserCircle,
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoClose } from "react-icons/io5";


const Navbar = () => {
  /* ---------------------- state & refs ---------------------- */
  const [categories, setCategories] = useState([]);           // ✅ live data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);           // holds cat.id
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState(null);   // holds cat.id
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const menuRef = useRef(null);



  const hideTimeout = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { get } = useApi();
  const userId = localStorage.getItem("userId")
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [user, setUser] = useState(null);
  const userType = localStorage.getItem("userType");
  const [announcements, setAnnouncements] = useState([]);

  const [keywordDesktop, setKeywordDesktop] = useState("");
  const [keywordMobile, setKeywordMobile] = useState("");

  const [suggestionsDesktop, setSuggestionsDesktop] = useState([]);
  const [suggestionsMobile, setSuggestionsMobile] = useState([]);

  const [showDropdownDesktop, setShowDropdownDesktop] = useState(false);
  const [showDropdownMobile, setShowDropdownMobile] = useState(false);

  const [loadingDesktop, setLoadingDesktop] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    fetchUserById()
    fetchAnnouncements()
    getSuggestion();
  }, [])


  const fetchAnnouncements = async () => {
    try {
      const response = await get(`${endpoints.getAllAnnouncements}?status=${true}`);
      setAnnouncements(response.announcements || []);
    } catch (error) {
      console.log(first)("Failed to fetch announcements");
    }
  };



  const fetchUserById = async () => {
    try {
      const response = await get(`${endpoints.getUserById}/${userId}`);
      if (response.status && response.data) {
        const data = response.data;
        setUser(data);

      }
    } catch (error) {
      console.log("Error fetching user by ID:", error);
    }
  };


  const [cartCount, setCardCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  const [keyword, setKeyword] = useState("");
  const hoverTimeout = useRef(null);
  const leaveTimeout = useRef(null);
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false);



  const handleSearchKey = (e) => {
    if (e.key === "Enter" && keyword.trim() !== "") {
      navigate(`/global-search?keyword=${encodeURIComponent(keyword)}`);
      setKeyword(""); // optional: clears input
    }
  };

  const getSuggestion = async () => {
    try {
      if (!keyword.trim()) {
        setSuggestions([]);
        return;
      }
      const response = await get(`${endpoints.globalSearch}?keyword=${keyword}`);
      setSuggestions(response.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.log("Error fetching suggestions", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getSuggestion();
    }, 400); // debounce to avoid too many calls

    return () => clearTimeout(delayDebounce);
  }, [keyword]);



  useEffect(() => {
   
    fetchWishlist()
  }, []);

  useEffect(() => {
  fetchCarts(); // initial load

  // ✅ listen for custom cartUpdated event
  const handleCartUpdate = () => {
    fetchCarts();
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, []);

  // const fetchCarts = async () => {
  //    try {
  //   const guestCart=localStorage.getItem("guestCart")|| [];
  //   if(!userId){
  //     const itemCount=guestCart.length
  //     setCardCount(itemCount)
  //   }

  //     const response = await get(`${endpoints.getCartByUser}/${userId}`);
  //     const itemCount = response.data.length
  //     setCardCount(itemCount)


  //   } catch (error) {
  //     console.log("Error in fetching Cart", error);
  //   }
  // };

  const fetchCarts = async () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      // Handle guest user
      if (!userId) {
        setCardCount(guestCart.length);
        return;
      }

      // Handle logged-in user
      const response = await get(`${endpoints.getCartByUser}/${userId}`);
      const itemCount = response.data.length;
      setCardCount(itemCount);

    } catch (error) {
      console.log("Error in fetching Cart", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await get(`${endpoints.getWishlistByUser}/${userId}`);
      const itemCount = response.data.length
      setWishCount(itemCount)

    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
    }
  };

  /* ------------------ fetch & normalise categories ------------------ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get(endpoints.getAllMainCategories);
        const mainCategories = (res.data || []).map((main) => ({
          id: main.id,
          name: main.name,
          slug: main.slug,
          image: main.image,
          categories: (main.categories || []).map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subCategories: (cat.subCategories || []).map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
            })),
          })),
        }));
        setCategories(mainCategories);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);



  // ⬅︎ only once on mount



  /* ---------------- dropdown delay helpers ---------------- */
  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setActiveCat(null);
    }, 1500);
  };

  useEffect(() => () => clearTimeout(hideTimeout.current), []);

  /* ------------- close profile dropdown on outside‑click ------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ========================================================= */
  return (
    <>
      {/* Announcement bar */}

      {announcements.map((item) => (<div className="bg-black text-white text-sm text-center py-2">
        {item?.message}&nbsp;
        {!userType && (<Link to={item?.link} className="underline font-medium text-white">
          Click Here
        </Link>)}

      </div>))}

      {/* NAVBAR */}
      <nav className="bg-white  shadow-md sticky top-0 z-50  my-text ">
        <div className="max-w-8xl mx-auto px-4 py-4 flex items-center  justify-between">
          {/* Logo */}
          <div
            className="text-2xl font-bold nav-text  cursor-pointer"
            onClick={() => navigate("/")}
          >
            Bab {/* <img src="/image.png" className="h-10 w-10"/> */}
          </div>

          {/* ------------ desktop links ------------ */}
          <div className="hidden md:flex items-center gap-7  text-black ">
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "#282C3F" }}

            >
              Home
            </NavLink>



            {categories.slice(0, 5).map((main) => (
              <div
                key={main.id}
                className="relative group"
                onMouseEnter={() => {
                  clearTimeout(leaveTimeout.current);
                  hoverTimeout.current = setTimeout(() => {
                    setHoveredCategory(main.id);
                  }, 200);
                }}
                onMouseLeave={() => {
                  clearTimeout(hoverTimeout.current);
                  leaveTimeout.current = setTimeout(() => {
                    setHoveredCategory(null);
                  }, 200);
                }}
              >
                {/* MAIN CATEGORY - Clickable */}
                <NavLink
                  to="/product_list"
                  state={{ mainCategoryId: main.id }}
                  className=" py-2 no-underline   "
                  style={{ color: "#282C3F" }}


                >
                  {main.name}
                </NavLink>

                {/* DROPDOWN MENU */}
                {hoveredCategory === main.id && (
                  <div className="absolute left-0 top-12 bg-white shadow-2xl z-50 rounded-sm py-6 px-8 w-max max-w-[100vw]">

                    <div className="flex gap-8">
                      {main.categories.map((cat) => (
                        <div key={cat.id}>
                          {/* CATEGORY - Clickable */}
                          <Link
                            to="/product_list"
                            state={{ categoryId: cat.id }}
                            className="!text-pink-700 no-underline font-bold text-sm mb-3 inline-block hover:underline"
                            onClick={() => setHoveredCategory(null)}
                          >
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                          </Link>
                          <ul className="space-y-1 mt-2 px-0">
                            {cat.subCategories.map((sub) => (
                              <li key={sub.id}>
                                {/* SUBCATEGORY - Clickable */}
                                <Link
                                  to="/product_list"
                                  state={{ categoryId: cat.id, subCategoryId: sub.id }}
                                  className="text-[13px] no-underline  !text-black/70 hover:!text-black hover:!text-[14px] transition-all"
                                  onClick={() => setHoveredCategory(null)}
                                >
                                  {sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="relative inline-block">
              <NavLink
                to="/reel-ramp"
                style={{ textDecoration: "none", color: "#282C3F" }}

              >
                ReelRamp
              </NavLink>

              {/* Superscript Badge */}
              <span className="absolute -top-3 -right-15  bg-red-200 text-red-500  text-[10px] px-2 py-[1px] rounded-full">
                Coming Soon
              </span>
            </div>







          </div>

          {/* ------------ desktop search ------------ */}
          {/* ------------ desktop search ------------ */}
          <div className="relative w-[35rem] hidden md:block">
            <div className="flex items-center border bg-gray-100 rounded-xl px-3 py-2 ml-10">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent outline-none text-sm w-full"
                value={keywordDesktop}
                onChange={async (e) => {
                  const value = e.target.value;
                  setKeywordDesktop(value);

                  if (value.trim()) {
                    setLoadingDesktop(true);
                    try {
                      const res = await get(`${endpoints.globalSearch}?keyword=${value}`);
                      setSuggestionsDesktop(res.data || []);
                      setShowDropdownDesktop(true);
                    } catch (err) {
                      setSuggestionsDesktop([]);
                    } finally {
                      setLoadingDesktop(false);
                    }
                  } else {
                    setSuggestionsDesktop([]);
                    setShowDropdownDesktop(false);
                  }
                }}

                onFocus={() => setShowDropdownDesktop(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && keywordDesktop.trim()) {
                    navigate(`/global-search?keyword=${encodeURIComponent(keywordDesktop)}`);
                    setKeywordDesktop("");
                    setShowDropdownDesktop(false);
                  }
                }}
                onBlur={() => setTimeout(() => setShowDropdownDesktop(false), 200)}
              />
            </div>

            {showDropdownDesktop && (
              <div className="absolute top-full mt-0  w-full bg-white border ml-10  shadow-md max-h-60 overflow-y-auto z-50">
                {loadingDesktop ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                ) : suggestionsDesktop.length > 0 ? (
                  suggestionsDesktop.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        navigate(`/global-search?keyword=${encodeURIComponent(item.title)}`);
                        setKeywordDesktop("");
                        setShowDropdownDesktop(false);
                      }}
                    >
                      {item.title}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
                )}
              </div>
            )}

          </div>


          {/* ------------ icons & profile ------------ */}
          <div className="flex items-center nav-text gap-4">
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="nav-text-bg p-2 rounded-full text-white" style={{ borderRadius: "50%" }}>
                <FaRegUser size={20} />
              </button>


              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">

                    {/* 🔹 Case 1: userType nahi hai → sirf Login/Signup */}
                    {userType !== "user" && (
                      <>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/signup");
                          }}
                          className="py-2 hover:bg-gray-100 nav-text cursor-pointer flex items-center gap-2"
                        >
                          <FaSignInAlt /> Signup
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/login");
                          }}
                          className="py-2 hover:bg-gray-100 nav-text cursor-pointer flex items-center gap-2"
                        >
                          <FaSignInAlt /> Login
                        </li>
                        <li
                          onClick={() => {
                            if (userType === "user") {
                              navigate("/become_seller", { state: { userId: userId } });
                              setIsProfileDropdownOpen(false);
                            } else {
                              setIsProfileDropdownOpen(false);
                              navigate("/seller-login");
                            }
                          }
                          }
                          className="py-2 hover:bg-gray-100 nav-text cursor-pointer flex items-center gap-2"
                        >
                          <FaSignInAlt /> Become a Seller
                        </li>
                      </>
                    )}

                    {/* 🔹 Case 2: userType === "user" → pura dropdown */}
                    {userType === "user" && (
                      <>
                        <p>
                          Hello, {user?.fullName}
                          <br />
                          {user?.phoneNo}
                        </p>

                        <hr />
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/cart");
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <MdOutlineShoppingCart /> Cart
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/wishlist");
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <FaHeart /> Wishlist
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/profile");
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <FaUser /> Profile
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/myorder");
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <FaBoxOpen /> My Order
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/profile", { state: { activeTab: "wallet" } });
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <FaWallet /> My Wallet
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/profile", { state: { activeTab: "coupon" } });
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <FaTicketAlt /> Coupon
                        </li>

                        <hr />
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/profile", { state: { activeTab: "edit" } });
                          }}
                          className="py-2 nav-text hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <FaEdit /> Edit Profile
                        </li>

                        <li
                          onClick={() => {
                            if (userType === "user") {
                              navigate("/become_seller", { state: { userId: userId } });
                              setIsProfileDropdownOpen(false);
                            } else {
                              setIsProfileDropdownOpen(false);
                              navigate("/seller-login");
                            }
                          }
                          }
                          className="py-2 hover:bg-gray-100 nav-text cursor-pointer flex items-center gap-2"
                        >
                          <FaSignInAlt /> Become a Seller
                        </li>
                        <li
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            localStorage.clear();
                            toast.success("Logout Successfully");
                            navigate("/");
                          }}
                          className="py-2 hover:bg-gray-100 nav-text cursor-pointer flex items-center gap-2"
                        >
                          <FaSignInAlt /> Logout
                        </li>


                      </>
                    )}

                    {/* 🔹 Case 3: agar userType seller/admin hai → kuch bhi nahi show hoga */}
                  </ul>
                </div>
              )}

            </div>
            <Link to="/wishlist" className="relative p-2 rounded-full nav-text-bg text-white">
              <FaRegHeart size={20} />
              {/* wistlist count */}

            </Link>
            <Link to="/cart" className="relative p-2 rounded-full nav-text-bg text-white">
              <MdOutlineShoppingCart size={20} />

              {/* Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>



            {/* Hamburger */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-700">
              {isMobileMenuOpen ? <FaBars size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* ------------------ MOBILE MENU ------------------ */}
        {isMobileMenuOpen && (
          <div
            ref={menuRef}
            className={`fixed  top-0 left-0 h-full w-3/4 bg-white shadow-lg z-50 
      ${isMobileMenuOpen ? "animate-slide-in-left" : "animate-slide-out-left"}`}
          >

            <div className="flex items-center justify-between bg-purple text-white px-4 py-3">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl" />
                <span className="font-semibold">{user?.fullName}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl"
              >
                <IoClose />
              </button>
             
            </div>
            <div className="px-4 py-4">
              {/* Home Link */}
              <Link to="/" className="block py-2 text-black font-medium " style={{ textDecoration: 'none' }}>Home</Link>

              {/* Categories with Subcategories */}

              {categories.map((main) => (
                <div key={main.id} className=" py-2">
                  {/* Main Category */}
                  <div
                    onClick={() => {
                      setOpenMobileCat(openMobileCat === main.id ? null : main.id);
                      setActiveCategoryId(main.id);
                      navigate("/product_list", { state: { mainCategoryId: main.id } });
                      // setOpenMobileCat(null);
                    }}
                    className="flex items-center justify-between w-full text-gray-800 font-medium cursor-pointer"
                  >
                    {main.name}
                    <IoMdArrowDropdown 
                      className={`transition-transform ${openMobileCat === main.id ? "rotate-180" : ""
                        }`}
                    />
                  </div>

                  {/* Nested Categories */}
                  {openMobileCat === main.id && (
                    <div className="ml-4 mt-2 space-y-2 text-sm text-gray-700">
                      {main.categories.map((cat) => (
                        <div key={cat.id}>
                          {/* Category */}
                          <div
                            onClick={() => {
                              setOpenMobileCat(openMobileCat === cat.id ? null : cat.id);
                              navigate("/product_list", { state: { categoryId: cat.id } });
                              setOpenMobileCat(null);
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center justify-between py-1 cursor-pointer"
                          >
                            <span className="font-medium">{cat.name}</span>
                            <IoMdArrowDropdown
                              className={`transition-transform ${openMobileCat === cat.id ? "rotate-180" : ""
                                }`}
                            />
                          </div>

                          {/* Subcategories */}
                          {openMobileCat === cat.id && cat.subCategories?.length > 0 && (
                            <ul className="ml-4 mt-1 space-y-1">
                              {cat.subCategories.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    to="/product_list"
                                    state={{ categoryId: cat.id, subCategoryId: sub.id }}
                                    className="block text-gray-600 hover:text-black"
                                    onClick={() => {
                                      setOpenMobileCat(null);
                                      setIsMobileMenuOpen(false)
                                    }}

                                  >
                                    {sub.name}
                                  </Link>
                                </li>

                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="relative inline-block mt-1">
                <NavLink
                  to="/"
                  style={{ textDecoration: "none" }}
                  className={({ isActive }) =>
                    `text-black ${isActive ? "" : ""}`
                  }
                >
                  ReelRamp
                </NavLink>

                {/* Superscript Badge */}
                <span className="absolute -top-3 -right-15  bg-red-500 text-white  text-[10px] px-2 py-[1px] rounded-full">
                  Coming Soon
                </span>
              </div>

              {/* Search Bar */}
              {/* Mobile Search Bar */}
              {/* Mobile Search Bar */}
              <div className="relative mt-2 md:hidden">
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="bg-transparent outline-none text-sm w-full"
                    value={keywordMobile}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setKeywordMobile(value);

                      if (value.trim()) {
                        setLoadingMobile(true);
                        try {
                          const res = await get(`${endpoints.globalSearch}?keyword=${value}`);
                          setSuggestionsMobile(res.data || []);
                          setShowDropdownMobile(true);
                        } catch (err) {
                          setSuggestionsMobile([]);
                        } finally {
                          setLoadingMobile(false);
                        }
                      } else {
                        setSuggestionsMobile([]);
                        setShowDropdownMobile(false);
                      }
                    }}

                    onFocus={() => setShowDropdownMobile(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && keywordMobile.trim()) {
                        navigate(`/global-search?keyword=${encodeURIComponent(keywordMobile)}`);
                        setKeywordMobile("");
                        setShowDropdownMobile(false);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowDropdownMobile(false), 200)}
                  />
                </div>

                {showDropdownMobile && (
                  <div className="absolute top-full mt-2 w-full bg-white  rounded-xl shadow-md max-h-60 overflow-y-auto z-50">
                    {loadingMobile ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                    ) : suggestionsMobile.length > 0 ? (
                      suggestionsMobile.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => {
                            navigate(`/global-search?keyword=${encodeURIComponent(item.title)}`);
                            setKeywordMobile("");
                            setShowDropdownMobile(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {item.title}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
                    )}
                  </div>
                )}

              </div>



              {/* Wishlist & Cart */}
              {/* <div className="flex items-center justify-start gap-6 mt-4">
              <Link to="/wishlist" className="relative p-2 rounded-full nav-text-bg text-white">
                <FaRegHeart size={20} />
              </Link>
              <Link to="/cart" className="relative p-2 rounded-full nav-text-bg text-white">
                <MdOutlineShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div> */}

              {/* Profile Options */}
              {/* <div className="mt-4 border-t pt-4">
              {!token ? (
                <>
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/signup");
                    }}
                    className="flex items-center gap-2 py-2 nav-text cursor-pointer hover:bg-gray-100"
                  >
                    <FaSignInAlt /> Signup
                  </div>
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="flex items-center gap-2 py-2 nav-text cursor-pointer hover:bg-gray-100"
                  >
                    <FaSignInAlt /> Login
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      localStorage.clear();
                      toast.success("Logout Successfully");
                      navigate("/");
                    }}
                    className="flex items-center gap-2 py-2 nav-text cursor-pointer hover:bg-gray-100"
                  >
                    <FaSignInAlt /> Logout
                  </div>
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center gap-2 py-2 nav-text cursor-pointer hover:bg-gray-100"
                  >
                    <FaUser /> Profile
                  </div>
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/myorder");
                    }}
                    className="flex items-center gap-2 py-2 nav-text cursor-pointer hover:bg-gray-100"
                  >
                    <FaBoxOpen /> My Order
                  </div>
                </>
              )}
            </div> */}
            </div>
          </div>

        )}
      </nav>
    </>
  );
};

export default Navbar;
