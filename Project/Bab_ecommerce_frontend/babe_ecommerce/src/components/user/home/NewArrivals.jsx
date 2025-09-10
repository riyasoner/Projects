import React, { useEffect, useState } from "react";
import "../../../App.css";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaHeart, FaRegHeart, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaBolt, FaShoppingCart } from "react-icons/fa";
import ProtectedRoute from "../../../layout/ProtectedRoute";
import BrowseByStyle from "./BrowseByStyle";

const NewArrivals = () => {
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [quantity, setQuantity] = useState(1)
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [baseTotal, setBaseTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const userType = localStorage.getItem("userType")



  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await get(`${endpoints.getCartByUser}/${userId}`);
      setCartItems(response.data || []);
    } catch (error) {
      console.log("Error in fetching Cart", error);
    }
  };

  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtTheTime,
      0
    );
    const discount = cartItems.reduce((sum, item) => {
      const pct = item.cartProduct?.discountPercent || 0;
      return sum + item.quantity * item.priceAtTheTime * (pct / 100);
    }, 0);
    const total = subtotal - discount;

    setBaseTotal(total);

    if (couponDiscount === 0) {
      setFinalTotal(total);
    }
  }, [cartItems]);





  useEffect(() => {
    const fetchProducts = async () => {
      try {


        const newRes = await get(endpoints.getNewArrivalProducts);
        setNewArrivalProducts((newRes.products || []).slice(0, 4));

        const topRes = await get(endpoints.getOnSaleProducts);
        setTopSellingProducts((topRes.products || []).slice(0, 4));

        const wishlistRes = await get(`${endpoints.getWishlistByUser}/${userId}`);
        setWishlistIds(wishlistRes.data?.map((item) => item.productId) || []);

      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };
    fetchProducts();
  }, []);

  const toggleWishlist = async (product, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");

    const payload = {
      userId,
      productId: product.id,
    };

    try {
      if (wishlistIds.includes(product.id)) {
        // remove from wishlist
        const response = await post(endpoints.removeFromWishlist, payload);
        toast.success(response.message || "Removed from wishlist");
        setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      } else {
        // add to wishlist
        const response = await post(endpoints.addToWishlist, payload);
        toast.success(response.message || "Added to wishlist");
        setWishlistIds((prev) => [...prev, product.id]);
      }
    } catch (error) {
      console.log("Wishlist toggle error:", error.message);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtTheTime,
    0
  );
  const discount = cartItems.reduce((sum, item) => {
    const pct = item.cartProduct?.discountPercent || 0;
    return sum + item.quantity * item.priceAtTheTime * (pct / 100);
  }, 0);
  const total = subtotal - discount;


  // const buyNow = async (product) => {
  //   if (!userId) {
  //     toast.error("Please login to add items to cart");
  //     navigate("/login");
  //     return;
  //   }

  //   const payload = {
  //     userId: userId,
  //     productId: product.id,
  //     quantity: quantity,
  //     variantId: product?.variants?.[0]?.id,
  //   };

  //   try {
  //     await post(endpoints.addToCart, payload);

  //     // 🟡 Re-fetch cart to get updated data
  //     const response = await get(`${endpoints.getCartByUser}/${userId}`);
  //     const updatedCartItems = response.data || [];

  //     // 🟡 Recalculate total and discount
  //     const newSubtotal = updatedCartItems.reduce(
  //       (sum, item) => sum + item.quantity * item.priceAtTheTime,
  //       0
  //     );

  //     const newDiscount = updatedCartItems.reduce((sum, item) => {
  //       const pct = item.cartProduct?.discountPercent || 0;
  //       return sum + item.quantity * item.priceAtTheTime * (pct / 100);
  //     }, 0);

  //     const newFinalTotal = newSubtotal - newDiscount;

  //     // 🟢 Navigate after everything is ready
  //     navigate("/checkout", {
  //       state: {
  //         cartItems: updatedCartItems,
  //         finalTotal: newFinalTotal,
  //         discount: newDiscount,
  //         couponDiscount,
  //         couponCode,
  //       },
  //     });

  //   } catch (error) {
  //     toast.error(error.message || "Something went wrong");
  //   }
  // };

  const buyNow = async (product) => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const payload = {
      userId: userId,
      productId: product.id,
      quantity: quantity,
      variantId: product?.variants?.[0]?.id,
    };

    try {
      // 1️⃣ Add product to cart (backend flow maintain karna hai)
      await post(endpoints.addToCart, payload);
      window.dispatchEvent(new Event("cartUpdated"));

      // 2️⃣ Variant object prepare karo
      const selectedVariant = product?.variants?.[0] || {};

      // 3️⃣ Cart-like object build karo (API ke format me)
      const buyNowItem = {
        id: Date.now(), // temp id
        userId,
        productId: product.id,
        quantity: quantity,
        priceAtTheTime: selectedVariant.price || product.price,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // ✅ Variant
        variant: {
          id: selectedVariant.id,
          variantName: selectedVariant.variantName || product.title,
          size: selectedVariant.size || "Free",
          price: selectedVariant.price || product.price,
          discountPercent: selectedVariant.discountPercent || product.discountPercent || 0,
          variantImages: selectedVariant.variantImages || product.images || [],
        },

        // ✅ Product
        cartProduct: {
          id: product.id,
          title: product.title,
          brand: product.brand,
          returnPolicy: product.returnPolicy,
          paymentOptions: product.paymentOptions || [],
          discountPercent: product.discountPercent || 0,
          description: product.description,
        },
      };

      // 4️⃣ Totals calculate karo
      const subtotal = buyNowItem.quantity * buyNowItem.priceAtTheTime;

      const discount =
        buyNowItem.quantity *
        buyNowItem.priceAtTheTime *
        ((buyNowItem.variant.discountPercent || 0) / 100);

      const finalTotal = subtotal - discount;

      // 5️⃣ Navigate only with this one item
      navigate("/checkout", {
        state: {
          cartItems: [buyNowItem],
          finalTotal,
          discount,
          couponDiscount,
          couponCode,
        },
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      syncGuestCartToUserCart(userId);
    }
  }, []);




  const addToCart = async (product) => {
    if (!userId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const existingIndex = guestCart.findIndex(
        (i) => i.id === product.id && i.variantId === product?.variants?.[0]?.id
      );

      if (existingIndex !== -1) {
        // quantity update
        guestCart[existingIndex].quantity =
          (guestCart[existingIndex].quantity || 1) + (product.quantity || 1);
      } else {

        const productToAdd = {
          ...product,
          variantId: product?.variants?.[0]?.id || null,
          quantity: product.quantity || 1,
        };
        guestCart.push(productToAdd);
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      toast.success("Added to cart");
      fetchCarts()
      window.dispatchEvent(new Event("cartUpdated"));

      return;
    }



    const payload = {
      userId: userId,
      productId: product.id,
      quantity: quantity,
      variantId: product?.variants?.[0]?.id,
    };

    try {
      const res = await post(endpoints.addToCart, payload);
      toast.success(res.message || "Product Added Successfully. Go to Cart");
      fetchCarts();
      window.dispatchEvent(new Event("cartUpdated"));


    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };


  const syncGuestCartToUserCart = async (userId) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    if (guestCart.length === 0) return;

    // Prepare the payload for /ecommerce/cartSync
    const payload = {
      userId: userId,
      cartItems: guestCart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        variantId: item.variantId || item?.variants?.[0]?.id,
        priceAtTheTime: item.variants?.[0]?.price
      })),
    };

    try {
      const res = await post(endpoints.cartSync, payload);
      localStorage.removeItem("guestCart");
      // toast.success(res.message || "Guest cart synced to your account");
    } catch (error) {
      toast.error(error.message || "Failed to sync cart items");
    }
  };




  const getFirstImage = (product) => {
    // const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    if (product.images?.[0]) {
      return `${product.images[0]}`;
    } else if (product.variants?.[0]?.images?.[0]) {
      return `${product.variants[0].images[0]}`;
    } else {
      return "/photo/dressStyle1.png";
    }
  };

  const getOldPrice = (p) =>
    p.discountPercent
      ? (p.price / (1 - p.discountPercent / 100)).toFixed(0)
      : null;

  const repeatRating = (rating = 4) => "⭐".repeat(Math.floor(rating));


  const ProductCard = ({ product }) => (



    <div
      className="product-card"
      onClick={() =>
        navigate("/product_page", { state: { productId: product.id } })
      }
    >
      {/* Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (userType !== "user") {
             return navigate("/login")

            // return toast.error("Please login to add products to wishlist!")
          }
          toggleWishlist(product, e)
        }}
        className={`wishlist-button ${wishlistIds.includes(product.id)
          ? "active-wishlist"
          : ""
          }`}
      >
        {wishlistIds.includes(product.id) ? (
          <FaHeart className="text-xl" />
        ) : (
          <FaRegHeart className="text-xl" />
        )}
      </button>

      {/* Card content */}
      <div className="card-content">
        <div className="product-image relative">
          <img src={getFirstImage(product)} alt={product.title} />
          {product?.rating && (
            <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold flex items-center shadow">
              <span className="text-green-600">{product.rating}</span>
              <span className="ml-1 text-gray-500">★</span>
              {product?.reviews && <span className="ml-1 text-gray-500">| {product.reviews}</span>}
            </div>
          )}
        </div>
        <div className="content">
          <h3 className="line-clamp-1">{product?.variants[0]?.variantName}</h3>
          <p className="text-gray-700 text-sm  line-clamp-1">{product?.description}</p>
          <div className="price flex items-center gap-2">
            {/* Current Price */}
            <span className="text-sm font-bold text-gray-900 ">
              Rs.{product.price}
            </span>

            {/* Old Price */}
            {getOldPrice(product) && (
              <span className="text-[12px] text-gray-500 line-through">
                Rs.{getOldPrice(product)}
              </span>
            )}

            {/* Discount */}
            {getOldPrice(product) && (
              <span className="text-xs font-semibold off " style={{ color: "#FF9E6A" }}>
                ({Math.round(
                  ((getOldPrice(product) - product.price) / getOldPrice(product)) * 100
                )}
                % OFF)
              </span>
            )}
          </div>
        </div>
        {/* {(product?.stock === 0 ||
          product?.variants?.some((v) => v.stock === 0)) && (
            <span className="out-of-stock">Out Of Stock</span>
          )} */}
        {/* Buy Now button */}
        <button
          className={`buy-now-btn ${product?.stock === 0 ||
            product?.variants?.some((v) => v.stock === 0)
            ? "disabled"
            : ""
            }`}
          onClick={(e) => {
            e.stopPropagation();
            if (userType !== "user") {
              return navigate("/login")
            }
            if (
              product?.stock === 0 ||
              product?.variants?.some((v) => v.stock === 0)
            )
              return;
            navigate(buyNow(product));
          }}
        >
          {(product?.stock === 0 ||
            product?.variants?.some((v) => v.stock === 0)) ? (<>
              <FaTimesCircle className="inline-block mr-1 " />
              Out Of Stock
            </>) : (<>
              <FaBolt className="inline-block mr-1 " />
              Buy Now</>)}
        </button>
      </div>

      {/* Hover center Add to Cart */}
      <div
        className="center-button"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
        }}
      >
        <FaShoppingCart />

      </div>
    </div>


  );

  return (
    <>
      {/* 🆕 New Arrivals */}
      <section id="newarrivals" className="py-4">
        <div className="max-w-7xl  mx-auto px-4 relative">
          <h1
            className="text-xl heading font-bold mb-10 text-left"

          >
            New Arrivals
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {newArrivalProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className=" absolute text-center top-0 right-0">
            <p
              onClick={() => navigate("/new_arrival")}
              className="inline-block text-lg font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 relative cursor-pointer after:block after:w-0 after:h-[2px] after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              View All
            </p>
          </div>

        </div>
      </section>

      {/* 🔝 Top Selling */}
      <section className="py-4">
        <div className="max-w-7xl  mx-auto px-4 relative ">
          <h1
            className="text-4xl   mb-10 text-left"

          >
            Top Selling
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {topSellingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className=" absolute text-center mt-6 top-0 right-0">
            <p
              onClick={() => navigate("/on_sale")}
              className="inline-block text-lg font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 relative cursor-pointer after:block after:w-0 after:h-[2px] after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              View All
            </p>
          </div>
        </div>
      </section>

      {/* 🎽 Browse by Dress Style */}
      <BrowseByStyle />
    </>
  );
};

export default NewArrivals;
