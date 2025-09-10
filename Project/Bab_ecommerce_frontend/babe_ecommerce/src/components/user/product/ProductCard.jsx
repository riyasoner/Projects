import React, { useEffect, useState } from "react";
import { FaStar, FaHeart, FaShoppingCart, FaBolt, FaRegHeart, FaTimesCircle } from "react-icons/fa";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId")
  const [wishlistIds, setWishlistIds] = useState([]);
  const [quantity, setQuantity] = useState(1)

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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const wishlistRes = await get(`${endpoints.getWishlistByUser}/${userId}`);
        setWishlistIds(wishlistRes.data?.map((item) => item.productId) || []);

      } catch (error) {
        console.log("Error", error)
      }
    }
    fetchProduct()
  }, [])

  const addToWishList = async (product, e) => {
    e.stopPropagation();
    const payload = {
      userId: localStorage.getItem("userId"),
      productId: product.id,
    };
    try {
      const response = await post(endpoints.addToWishlist, payload);
      toast.success(response.message || "Added to wishlist");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Derived values
  const firstImage = item?.variants?.[0]?.images?.[0] || item?.images?.[0];
  const name = item?.title || "Product Name";
  const rating = item?.rating || 4.5;
  const price = item?.variants?.[0]?.price || item?.price || 0;
  const discountPercent =
    item?.variants?.[0]?.discountPercent || item?.discountPercent || 0;
  const oldPrice =
    discountPercent > 0
      ? (price / (1 - discountPercent / 100)).toFixed(2)
      : null;

  const repeatRating = (rating = 4) => {
    const filledStars = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < filledStars ? "text-yellow-400" : "text-gray-300"}
      />
    ));
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

  return (

  

    <div
      className="product-card "
      
      onClick={() =>
        navigate("/product_page", { state: { productId: item.id } })
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
        }}
        className={`wishlist-button ${wishlistIds.includes(item.id)
          ? "active-wishlist"
          : ""
          }`}
      >
        {wishlistIds.includes(item.id) ? (
          <FaHeart className="text-xl" />
        ) : (
          <FaRegHeart className="text-xl" />
        )}
      </button>

      {/* Card content */}
      <div className="card-content">
        <div className="product-image">
          <img
            src={firstImage}
            alt={name}
            className="w-full h-52 object-cover mb-4 rounded-lg"
          />

        </div>
        <h3 className="line-clamp-1">{item?.variants[0]?.variantName}</h3>
          <p className="text-gray-700 text-sm  line-clamp-1">{item?.description}</p>
        <div className="price flex items-center gap-2">
          {/* Current Price */}
          <span className="text-sm font-bold text-gray-900">
            Rs.{price}
          </span>

          {/* Old Price */}
          {oldPrice && (
            <span className="text-[12px] text-gray-500 line-through">
              Rs.{oldPrice}
            </span>
          )}

          {/* Discount */}
          {oldPrice && (
            <span className="text-sm font-semibold " style={{color:"#FF9E6A"}}>
              ({Math.round(
                ((oldPrice- price) /oldPrice) * 100
              )}
              % OFF)
            </span>
          )}
        </div>
        {/* <div className="price"> 
          ₹{price}
          {oldPrice && (
            <span className="ml-2 text-sm line-through text-red-500">
              ₹{oldPrice}
            </span>
          )}
        </div> */}
        {/* {(item?.stock === 0 ||
          item?.variants?.some((v) => v.stock === 0)) && (
            <span className="out-of-stock f" style={{ fontStyle: "italic", fontSize: "12px" }}>Out Of Stock</span>
          )} */}
        {/* Buy Now button */}
        <button
          className={`buy-now-btn ${item?.stock === 0 ||
            item?.variants?.some((v) => v.stock === 0)
            ? "disabled"
            : ""
            }`}
          onClick={(e) => {
            e.stopPropagation();
            if (userType !=="user") {
              return navigate("/login")
            }
            if (
              item?.stock === 0 ||
              item?.variants?.some((v) => v.stock === 0)
            )
              return;
            navigate(buyNow(item));
          }}
        >
          {(item?.stock === 0 ||
            item?.variants?.some((v) => v.stock === 0)) ? (<>
              <FaTimesCircle className="inline-block mr-1 text-red-600" />
              Out Of Stock
            </>) : <>
            <FaBolt className="inline-block mr-1" />
            Buy Now</>}
        </button>
      </div>

      {/* Hover center Add to Cart */}
      <div
        className="center-button"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(item);
        }}
      >
        <FaShoppingCart />

      </div>
    </div>


  );
};

export default ProductCard;
