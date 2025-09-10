import React, { useEffect, useState, useRef, useCallback } from "react";
import "../../../App.css";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBolt, FaShoppingCart, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import EmptyProducts from "../pages/EmptyProducts";

const LIMIT = 10;

const GlobalSearch = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [quantity] = useState(1);

  const { get, post } = useApi();
  const navigate = useNavigate();
  const observer = useRef();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const userId = localStorage.getItem("userId");

  const [cartItems, setCartItems] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [baseTotal, setBaseTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const userType=localStorage.getItem("userType")
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
    console.log(buyNowItem)

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

  const fetchProducts = async (pageNum) => {
    try {
      const res = await get(
        `${endpoints.globalSearch}?keyword=${encodeURIComponent(keyword)}&page=${pageNum}&limit=${LIMIT}`
      );

      if (res.data?.length) {
        if (pageNum === 1) {
          setProducts(res.data);
        } else {
          setProducts((prev) => [...prev, ...res.data]);
        }
        setHasMore(res.data.length === LIMIT);
      } else {
        if (pageNum === 1) setProducts([]);
        setHasMore(false);
      }

      const wishlistRes = await get(`${endpoints.getWishlistByUser}/${userId}`);
      setWishlistIds(wishlistRes.data?.map((item) => item.productId) || []);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    if (keyword.trim()) {
      setPage(1);
      fetchProducts(1);
    }
  }, [keyword]);

  useEffect(() => {
    if (page > 1) fetchProducts(page);
  }, [page]);

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const toggleWishlist = async (product, e) => {
    e.stopPropagation();
    const payload = { userId, productId: product.id };

    try {
      if (wishlistIds.includes(product.id)) {
        const response = await post(endpoints.removeFromWishlist, payload);
        toast.success(response.message || "Removed from wishlist");
        setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      } else {
        const response = await post(endpoints.addToWishlist, payload);
        toast.success(response.message || "Added to wishlist");
        setWishlistIds((prev) => [...prev, product.id]);
      }
    } catch (error) {
      console.log("Wishlist toggle error:", error.message);
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
      fetchCarts();
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
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
    if (product.images?.[0]) return `${baseUrl}/${product.images[0]}`;
    if (product.variants?.[0]?.images?.[0])
      return `${baseUrl}/${product.variants[0].images[0]}`;
    return "/photo/dressStyle1.png";
  };

  const getOldPrice = (p) =>
    p.discountPercent ? (p.price / (1 - p.discountPercent / 100)).toFixed(0) : null;

  const ProductCard = ({ product, isLast }) => (
    <div ref={isLast ? lastProductRef : null}
      className="product-card"
      onClick={() =>
        navigate("/product_page", { state: { productId: product.id } })
      }
    >
      {/* Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (userType !=="user") {
            return navigate('/login')

            // return toast.error("Please login to add products to wishlist!")
          }
          toggleWishlist(product, e)
        }
        }
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
        <div className="product-image">
          <img src={getFirstImage(product)} alt={product.title} />
        </div>
        <h3 className="line-clamp-1">{product?.variants[0]?.variantName}</h3>
          <p className="text-gray-700 text-sm  line-clamp-1">{product?.description}</p>
        <div className="price flex items-center gap-2">
          {/* Current Price */}
          <span className="text-sm font-bold text-gray-900">
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
            <span className="text-sm font-semibold " style={{color:"#FF9E6A"}}>
              ({Math.round(
                ((getOldPrice(product) - product.price) / getOldPrice(product)) * 100
              )}
              % OFF)
            </span>
          )}
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
            if (userType !=="user") {
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
              <FaTimesCircle className="inline-block mr-1" />
              Out Of Stock
            </>) : (<>
              <FaBolt className="inline-block mr-1" />
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
    <section id="globalsearch" className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">
          {/* Search Results for "{keyword}" */}
          Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          {products.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center">
              <EmptyProducts />
            </div>
          ) : (
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isLast={index === products.length - 1}
              />
            ))
          )}
        </div>

        {!hasMore && products.length > 0 && (
          <p className="text-center mt-6 text-gray-500">
            🎉 You’ve reached the end!
          </p>
        )}
      </div>
    </section>
  );
};

export default GlobalSearch;
