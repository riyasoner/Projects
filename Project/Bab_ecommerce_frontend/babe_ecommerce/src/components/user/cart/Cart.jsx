import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaUndoAlt } from "react-icons/fa";
import Navbar from "../../../layout/Navbar";
import Footer from "../../../layout/Footer";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyCart from "../pages/EmptyCart";
import NewsLetter from "../newsletter/NewsLetter";
import { confirmAlert } from "react-confirm-alert";

// 🔹 Reusable Cart Item Component


const CartItem = ({ item, inc, dec, handleDeleteClick, isOutOfStock, customizations = [] }) => {
  const product = item.cartProduct;
  const variant = item.variant;
  console.log("variant", variant)
  console.log("item", item)
  const imageUrl = variant?.images?.[0]
    ? `${variant.images[0]}`
    : product.images?.[0];

  const productId =
    product?.id ?? product?.id ?? product?.productId ?? item?.productId;

  console.log("product Id", productId)

  const selVariantId =
    variant?.id ?? variant?.id ?? variant?.variantId ?? item?.variantId;

  console.log("Variant Id", selVariantId)

  // ✅ Find matching customization for this product (and variant if provided)

  const matchedCustomization = customizations.find(
    (c) =>
      c?.productId === productId &&
      (c?.variantId ? c.variantId === selVariantId : true)
  );
  //  console.log(matchedCustomization)
  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center border rounded-lg p-4 shadow-sm gap-4 
    ${isOutOfStock ? "opacity-80" : ""}`}


    >
      
      {/* ✅ Left Side Image & Right Side Content */}
      <div className="flex w-full  sm:w-auto items-center sm:items-start gap-8 sm:gap-4">
        {/* Product Image */}
        <img
          src={imageUrl}
          alt={product.title}
          className="w-20 h-20 sm:w-40 sm:h-40 object-cover flex-shrink-0"
        />

        {/* Details */}
        <div className="flex-1 text-xs sm:text-sm leading-snug">
          {/* Brand */}
          <p className="font-bold text-[12px] sm:text-[13px] mb-0 satosi_bold">
            {product?.brand.charAt(0).toUpperCase() + product?.brand.slice(1)}
          </p>
          {/* Title */}
          <p className="text-gray-700 text-[12px] sm:text-[14px] font-bold satosi_light line-clamp-1 mb-0">
             {variant?.variantName.charAt(0).toUpperCase() + variant?.variantName.slice(1)}
          </p>

          {/* Variant Info */}
          {variant && (
            <div className="text-gray-700 grid grid-cols-2 gap-x-2 text-[10px] sm:text-xs mt-1">
              {/* <p>Color: {variant?.color}</p> */}
              <p>Size: {variant?.size}</p>
            </div>
          )}

          {/* Customization */}
          {matchedCustomization && (
            <div className="rounded-md text-[10px] sm:text-xs mt-1">
              <span className="inline-block bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                Customize
              </span>
              <div className="grid grid-cols-2 gap-x-2 mt-1">
                {Object.entries(matchedCustomization.inputs || {}).map(
                  ([key, value]) => (
                    <p key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                      <span>{String(value)}</span>
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          {/* Out of Stock */}
          {isOutOfStock && (
            <span className="mt-1 inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-[5px] text-red-700 border border-red-700">
              Item Out of Stock
            </span>
          )}

          {/* Price Section */}
          {/* Price Section */}
          <div className="flex items-center gap-2 -mt-2 sm:mt-1 ">
            {variant?.discountPercent > 0 ? (
              <div className="flex flex-row items-center gap-2 sm:gap-2 flex-wrap">
                <p className="font-bold text-[10px] sm:text-[13] sm:text-sm text-green-700">
                  Rs.
                  {(
                    item.priceAtTheTime *
                    item.quantity *
                    (1 - variant.discountPercent / 100)
                  ).toFixed(2)}
                </p>
                <p className="text-gray-500 line-through text-[11px] sm:text-sm">
                  Rs.{(item.priceAtTheTime * item.quantity).toFixed(2)}
                </p>
                <span className="text-red-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                  -{variant.discountPercent}% OFF
                </span>
              </div>
            ) : (
              <p className="font-bold text-[13px] sm:text-lg">
                Rs.{(item.priceAtTheTime * item.quantity).toFixed(2)}
              </p>
            )}
          </div>


          {/* Return Policy */}
          <div className="flex items-center gap-1 text-gray-700 text-[11px] sm:text-sm -mt-2 sm-mt-1">
            <FaUndoAlt className="text-blue-500 text-sm flex-shrink-0" />
            <span>{product.returnPolicy || "No return policy"}</span>
          </div>
        </div>
      </div>

      {/* ✅ Quantity & Delete Buttons */}
      <div className="flex items-center gap-2 sm:gap-3  ml-2 -mt-2  sm:ml-0 sm:mt-0">
        <button
          className="border border-gray-400 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-lg font-medium hover:bg-gray-100"
          onClick={() => dec(item.id, item.quantity)}
          disabled={item.quantity === 1 || isOutOfStock}
        >
          -
        </button>
        <span className="text-sm sm:text-base font-medium">{item.quantity}</span>
        <button
          className="border border-gray-400 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-lg font-medium hover:bg-gray-100"
          onClick={() => inc(item.id, item.quantity)}
          disabled={isOutOfStock}
        >
          +
        </button>
        <button
          className="text-red-500 ml-1 sm:ml-2 text-lg hover:text-red-600"
          onClick={() => handleDeleteClick(item.id)}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>

  );
};

const CartPage = () => {
  const { get, post, del, patch } = useApi();
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [baseTotal, setBaseTotal] = useState(0);
  const [couponId, setCouponId] = useState(null);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType")

  const [customizations, setCustomizations] = useState([]);


  useEffect(() => {
    fetchCarts();
  }, []);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customizations")) || [];
    setCustomizations(saved);
  }, []);

  console.log(customizations)


  const fetchCarts = async () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Logged-in: Get cart from backend
      try {
        const response = await get(`${endpoints.getCartByUser}/${userId}`);
        setCartItems(response.data || []);
      } catch (error) {
        console.log("Error in fetching Cart", error);
      }
    } else {
      // Guest: Get cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const normalizedCart = guestCart.map((item) => {
        const variant =
          item.variants?.[0] || item.variants || item.variant || null;

        return {
          id: item.id,
          quantity: item.quantity || 1,
          priceAtTheTime: variant?.price || item.price,
          cartProduct: item,
          variant: variant,
          stock: variant?.stock || item.stock || 0,
        };
      });

      setCartItems(normalizedCart);
    }
  };

  // 🔹 Separate available and out-of-stock items
  const availableItems = cartItems.filter(
    (item) => (item?.stock > 0 || item?.variant?.stock > 0)
  );
  const outOfStockItems = cartItems.filter(
    (item) => item?.stock === 0 || item?.variant?.stock === 0
  );

  // 🔹 Totals only from available items
  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtTheTime,
    0
  );
  const discount = availableItems.reduce((sum, item) => {
    const pct = item.cartProduct?.discountPercent || 0;
    return sum + item.quantity * item.priceAtTheTime * (pct / 100);
  }, 0);
  const total = subtotal - discount;

  useEffect(() => {
    setBaseTotal(total);
    if (couponDiscount === 0) {
      setFinalTotal(total);
    }
  }, [availableItems]);

  const handleDelete = async (id) => {
    if (userId) {
      try {
        await del(`${endpoints.removeCartItem}/${id}`);
        // toast.success("Item removed from cart");
        fetchCarts();
          window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.log("Delete Error", error);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter((item) => item.id !== id);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      fetchCarts();
      // toast.success("Item removed from cart");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to remove Item from Cart?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(id) },
        { label: "No" },
      ],
       overlayClassName: "custom-overlay"
    });
  };

  const updateCartQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;
    if (userId) {
      const item = cartItems.find((c) => c.id === cartId);
      const stock = item?.variant?.stock ?? item?.stock ?? 0;

      if (newQty > stock) {
        toast.error("Out of Stock: Only " + stock + " items available");
        return;
      }
      try {
        await patch(`${endpoints.updateCartItem}`, {
          quantity: newQty,
          cartId: cartId,
        });
        setCartItems((prev) =>
          prev.map((c) => (c.id === cartId ? { ...c, quantity: newQty } : c))
        );
      } catch (err) {
        console.error("Qty-update error", err);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.map((item) => {
        if (item.id === cartId) {
          const variant =
            item.variants?.[0] || item.variants || item.variant || {};
          const stock = variant?.stock ?? item.stock ?? 0;
          if (newQty > stock) {
            toast.error("Out of Stock: Only " + stock + " items available");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      fetchCarts();
    }
  };

  const inc = (cartId, qty) => updateCartQuantity(cartId, qty + 1);
  const dec = (cartId, qty) => updateCartQuantity(cartId, qty - 1);

  const handleCoupon = async () => {
    const payload = {
      userId,
      code: couponCode,
      totalAmount: total,
      cartItems: cartItems
    };
    try {
      const response = await post(endpoints.applyCoupon, payload);
      toast.success(response.message || "Coupon applied successfully");
      setCouponDiscount(parseFloat(response.discount || 0));
      setFinalTotal(parseFloat(response.finalAmount || total));
      setCouponId(response.couponId || null);
      fetchCarts();
    } catch (error) {
      toast.error(error.message || "Invalid coupon");
    }
  };

  return (
    <section>
      <div className="max-w-7xl mx-auto ">
        {/* <h1 className="text-4xl font-extrabold mb-6">Your Cart</h1> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 rounded-xl p-6 shadow-sm">

          {cartItems.length === 0 ? (
  <div className="col-span-full flex justify-center items-center h-[500px]">
    <EmptyCart />
  </div>
) : (
  <>
    {/* Left: Cart Items */}
      <div className="lg:col-span-2 space-y-6">
            {availableItems.length > 0 && (
              <>
                <h4 className="text-xl font-bold  ">Items</h4>
                {availableItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    inc={inc}
                    dec={dec}
                    handleDeleteClick={handleDeleteClick}
                    customizations={customizations}  // ✅ pass here
                  />
                ))}

              </>
            )}


            {outOfStockItems.length > 0 && (
              <>
                <h4 className="text-xl font-bold mt-3 mb-0 text-red-600 ">
                  Out of Stock Items
                </h4>
                {outOfStockItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    inc={inc}
                    dec={dec}
                    handleDeleteClick={handleDeleteClick}
                    isOutOfStock
                    customizations={customizations}  // ✅ pass here too
                  />
                ))}


              </>
            )}

            {/* {cartItems.length === 0 && <EmptyCart />} */}
          </div>

    {/* Right: Order Summary */}
      <div className="w-full  h-fit border rounded-xl p-6">
            <p className="text-xl  mb-6 satosi_bold">Order Summary</p>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 mb-0 ">Original Price</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-500">
                <span> Product Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-700 ">Subtotal</span>
                <span className="font-semibold">₹{finalTotal.toFixed(2)}</span>
              </div>

              <hr className="border-t my-2" />
              <div className="flex justify-between items-center text-[15px] font-bold pt-3">
                <span className="text-black">Payable Amount</span>
                <span className="text-black">₹{finalTotal.toFixed(2)}</span>
              </div>

            </div>

            {/* Coupon Input */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-100 p-2 rounded-xl">
              <input
                type="text"
                placeholder="Add promo code"
                className="flex-1 bg-transparent outline-none px-3 py-2 text-sm w-full"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                className="button text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
                onClick={handleCoupon}
                disabled={!couponCode.trim()}
              >
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <button
              className="button text-white w-full py-3 rounded-full mt-6 text-center font-medium hover:bg-gray-800 transition"
              style={{ borderRadius: "100px" }}
              onClick={() => {
                if (userType !== "user") {
                  return navigate("/login");
                }
                if (availableItems.length > 0) {
                  navigate("/checkout", {
                    state: {
                      cartItems: availableItems,
                      finalTotal,
                      couponDiscount,
                      couponCode,
                      discount,
                      customizations,
                    },
                  });
                } else {
                  toast.error("No available items to checkout");
                }
              }}
            >
              Place Order →
            </button>
          </div>
  </>
)}

          {/* Left: Cart Items */}
        
          

          {/* Right: Order Summary */}
          {/* {cartItems.length >0 &&(
          
        )} */}
          
        </div>

        {/* Newsletter */}
        <NewsLetter />
      </div>
    </section>
  );
};

export default CartPage;
