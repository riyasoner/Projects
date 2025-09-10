import React, { useEffect, useState } from "react";
import Navbar from "../../../layout/Navbar";
import Footer from "../../../layout/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import endpoints from "../../../api/endpoints";
import useApi from "../../../hooks/useApi";
import { confirmAlert } from "react-confirm-alert";
import { FaArrowLeft, FaArrowRight, FaEdit, FaTrash, FaUndoAlt } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AddressForm from "./AddressForm"

const Checkout = () => {

    const [showNewAddress, setShowNewAddress] = useState(false);
    const { post, get, del, patch } = useApi();
    const { state } = useLocation();
    const cartItems = state?.cartItems || [];
    const navigate = useNavigate();
    const finalTotal = state?.finalTotal;
    const couponDiscount = state?.couponDiscount;
    const couponCode = state?.couponCode;
    const customization = state?.customizations;
    const [isOpen, setIsOpen] = useState(false);
    const [coupon, setCoupon] = useState("");
    console.log("cart Items",cartItems)


    const userId = localStorage.getItem("userId");

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [checkoutSummary, setCheckoutSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [walletData, setWalletData] = useState({});
    const [productData, setProductData] = useState([]);
    const [coins, setCoins] = useState(null);
    const [isCoin, setIsCoin] = useState(false);
    const [user, setUser] = useState(null);
    const [newAddress, setNewAddress] = useState({
        userId: userId,
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        type: "home",
        isDefault: true,
    });

    console.log("cartItem",cartItems)
    // --- Fetch Data ---
    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([fetchWallet(), fetchCoinData(), fetchProductData(), fetchAddresses(), fetchUser()]);
        };
        fetchAllData();
    }, []);

    const fetchCoinData = async () => {
        try {
            const response = await get(`${endpoints.getCoinBalanceByUserId}/${userId}`);
            setCoins(response.data || {});
        } catch (error) {
            console.log("Error fetching Coin by UserId", error);
            setCoins({});
        }
    };

    const fetchProductData = async () => {
        try {
            const formattedData = {
                products: cartItems.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId || null,
                })),
            };
            const res = await post(`${endpoints.getProductsByIds}`, formattedData);
            setProductData(res?.data || []);
        } catch (err) {
            console.error(err);
            // toast.error("Failed to fetch Products");
        }
    };

    const fetchWallet = async () => {
        try {
            const res = await get(`${endpoints.getUserWallet}/${userId}`);
            setWalletData(res?.data || {});
        } catch (err) {
            console.error(err);
            // toast.error("Failed to fetch wallet balance");
        }
    };

    const fetchUser = async () => {
        try {
            const response = await get(`${endpoints.getUserById}/${userId}`);
            setUser(response.data || {});
        } catch (error) {
            console.log("error for fetching User", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await get(`${endpoints.getAddressesByUser}/${userId}`);
            if (response.status) {
                setSavedAddresses(response.data);
                const defaultAddress = response.data.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setShippingAddressId(defaultAddress.id);
                    setShowNewAddress(false);
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    // --- Subtotal Calculation ---
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item?.variant?.price || 0;
            const discount = item?.variant?.discountPercent || 0;
            const discountedPrice = price - (price * discount) / 100;
            return total + discountedPrice * item.quantity;
        }, 0);
    };
    const subtotal = calculateSubtotal();
    const total = subtotal;

    // --- Address Handlers ---
    const handleDeleteAddress = async (id) => {
        try {
            const response = await del(`${endpoints.deleteAddress}/${id}`);
            if (response.status) {
                toast.success("Address deleted successfully.");
                fetchAddresses();
            }
        } catch (error) {
            toast.error("Failed to delete address.");
            console.error(error);
        }
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this Address?",
            buttons: [
                { label: "Yes", onClick: () => handleDeleteAddress(id) },
                { label: "No" },
            ],
        });
    };

    const [editingAddress, setEditingAddress] = useState(null);

    const handleEditAddress = (address) => {
        setEditingAddress(address); // Formik initialValues ko milega
        setShowNewAddress(true);
    };


    const saveAddress = async (values) => {
        try {
            if (values.id) {
                const response = await patch(`${endpoints.updateAddress}/${values.id}`, values);
                toast.success(response.message || "Address updated successfully!");
            } else {
                const response = await post(endpoints.addAddress, values);
                toast.success(response.message || "New address added successfully!");
            }
            fetchAddresses();
        } catch (err) {
            toast.error("Error saving address.");
            console.error(err);
        }
    };


    // --- Razorpay Loader ---
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                resolve(true); // already loaded
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        if (shippingAddressId && cartItems.length > 0) {
            handleCheckoutSummary();
        }
    }, [shippingAddressId, cartItems]);

    // --- Checkout & Order Placement ---
    const handleCheckoutSummary = async () => {
        try {
            const payload = {
                userId: Number(userId),
                shippingAddressId,
                couponCode: couponCode || coupon || null,
                items: cartItems.map(item => ({
                    productId: item.cartProduct?.id,
                    variantId: item.variant?.id,
                    quantity: item.quantity,
                })),
            };
            const response = await post(endpoints.checkout, payload);
            if (response.status) setCheckoutSummary(response);
            else toast.error(response.message || "Checkout failed.");
        } catch (err) {
            console.error(err);
            // toast.error("Error while generating checkout summary");
        }
    };


    const placeOrder = async () => {
        try {
            const payload = {
                userId: Number(userId),
                shippingAddressId,
                couponCode: couponCode || coupon || null,
                items: cartItems.map((item) => ({
                    productId: item.cartProduct?.id,
                    variantId: item.variant?.id,
                    quantity: item.quantity,
                    price:
                        item.variant.price -
                        (item.variant.price * item.variant.discountPercent) / 100,
                })),
            };

            // Validate checkout summary before placing order
            if (!checkoutSummary || !checkoutSummary.finalAmount) {
                toast.error("Please select a delivery address before placing your order.");
                return;
            }

            const finalAmount = parseFloat(checkoutSummary.finalAmount); // from API response

            // === COD Order Logic ===



            if (paymentMethod === "cod") {
                // Step 1: Check customization
                if (localStorage.getItem("customizations")) {
                    toast.info("Cash on Delivery is not available for customized products. Please choose a Prepaid Payment Method.");
                    return;
                }

                // Step 2: Filter COD supported products only
                const codProducts = productData.filter(
                    (item) => item?.paymentOptions && item.paymentOptions.includes("cod")
                );

                const onlineOnlyProducts = productData.filter(
                    (item) => !item?.paymentOptions || !item.paymentOptions.includes("cod")
                );

                console.log("COD Products =>", codProducts);
                console.log("Online Only Products (not ordered) =>", onlineOnlyProducts);

                // Step 3: Agar koi COD product hi nahi hai
                if (codProducts.length === 0) {
                    toast.error("No valid products available for Cash on Delivery.");
                    return;
                }

                // Step 4: Create order only with COD products
                const response = await post(endpoints.createOrder, {
                    userId: Number(userId),
                    shippingAddressId,
                    couponCode: couponCode || coupon || null,
                    isCoin: isCoin,
                    paymentMethod: "cod",
                    items: codProducts.map((p) => {
                        const cartItem = cartItems.find(ci => ci.cartProduct?.id === p.id);
                        return {
                            productId: p.id,
                            variantId: p.variants[0]?.id || null,
                            quantity: cartItem?.quantity || 1, // ✅ actual cart quantity
                            price: p.variants[0]?.price || p.price,
                        };
                    }),
                    amount: codProducts.reduce((sum, p) => {
                        const cartItem = cartItems.find(ci => ci.cartProduct?.id === p.id);
                        return sum + ((p.variants[0]?.price || p.price) * (cartItem?.quantity || 1));
                    }, 0),
                });

                if (response.status) {
                    toast.success("Order placed with Cash on Delivery!");
                    console.log(response);

                    // Step 5: Remove ONLY COD products (jo order ho gaye) from cart
                    const removePayload = {
                        userId: userId,
                        orderedItems: codProducts.map((p) => ({
                            productId: p.id,
                            variantId: p.variants[0]?.id || null,
                        })),
                    };

                    await post(endpoints.removeOrderedFromCart, removePayload);

                    // Step 6: Show info if any products still remain in cart
                    if (onlineOnlyProducts.length > 0) {
                        toast.info("Some products remain in your cart (not eligible for COD). You can purchase them with Online Payment.");
                    }

                    // Step 7: Redirect
                    navigate("/thankyou");
                } else {
                    toast.error(response.message || "Failed to place order");
                }
                return;
            }






            if (paymentMethod === "wallet+online") {
                if (walletData.realBalance > finalAmount) {
                    toast.info("You have enough balance. Please choose Wallet as your payment method.");
                    return;
                }

                const isScriptLoaded = await loadRazorpayScript();
                if (!isScriptLoaded) {
                    toast.error("Razorpay SDK failed to load.");
                    return;
                }

                // ✅ Sirf online supported products filter karo
                const onlineProducts = productData.filter(
                    (item) => item?.paymentOptions && item.paymentOptions.includes("online")
                );

                const codOnlyProducts = productData.filter(
                    (item) => !item?.paymentOptions || !item.paymentOptions.includes("online")
                );

                console.log("Wallet+Online Products =>", onlineProducts);
                console.log("COD Only Products (not ordered) =>", codOnlyProducts);

                if (onlineProducts.length === 0) {
                    toast.error("No valid products available for Wallet Payment.");
                    return;
                }

                // ✅ Sirf online products ke saath order banao
                const orderResponse = await post(endpoints.createOrder, {
                    userId: Number(userId),
                    shippingAddressId,
                    couponCode: couponCode || coupon || null,
                    isCoin: isCoin,
                    paymentMethod: "wallet+online",
                    items: onlineProducts.map((p) => {
                        const cartItem = cartItems.find(ci => ci.cartProduct?.id === p.id);
                        return {
                            productId: p.id,
                            variantId: p.variants[0]?.id || null,
                            quantity: cartItem?.quantity || 1,
                            price: p.variants[0]?.price || p.price,
                        };
                    }),
                    amount: onlineProducts.reduce((sum, p) => {
                        const cartItem = cartItems.find(ci => ci.cartProduct?.id === p.id);
                        return sum + ((p.variants[0]?.price || p.price) * (cartItem?.quantity || 1));
                    }, 0),
                });

                if (!orderResponse.status) {
                    toast.error(orderResponse.message || "Failed to initiate payment.");
                    return;
                }

                const razorpayOptions = {
                    key: orderResponse.razorpayKeyId,
                    amount: orderResponse.amount, // must be in paise
                    currency: "INR",
                    name: "Your Store",
                    order_id: orderResponse.razorpayOrderId,
                    handler: async function (razorpayResponse) {
                        try {
                            const verifyResponse = await post(endpoints.verifyRazorpayPayment, {
                                razorpayOrderId: razorpayResponse.razorpay_order_id,
                                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                                razorpaySignature: razorpayResponse.razorpay_signature,
                                orderId: orderResponse.orderId,
                            });

                            if (verifyResponse.status) {
                                toast.success("Payment successful and order placed!");

                                // ✅ Customizations only for ordered products
                                try {
                                    const customizations =
                                        JSON.parse(localStorage.getItem("customizations")) || [];

                                    if (customizations.length > 0) {
                                        const orderItems = onlineProducts.map((p) => ({
                                            productId: p.id,
                                            variantId: p.variants[0]?.id || null,
                                        }));

                                        for (const item of customizations) {
                                            const isProductInOrder = orderItems.some(
                                                (orderItem) => orderItem.productId === item.productId
                                            );

                                            if (isProductInOrder) {
                                                const customPayload = {
                                                    orderId: orderResponse.orderId,
                                                    productId: item.productId,
                                                    customData: item.inputs,
                                                };

                                                await post(endpoints.addOrderCustomisation, customPayload);
                                            }
                                        }

                                        localStorage.removeItem("customizations");
                                    }
                                } catch (err) {
                                    console.error("Error while saving customization:", err);
                                }

                                // ✅ Sirf ordered online products cart se hatana
                                const removePayload = {
                                    userId: userId,
                                    orderedItems: onlineProducts.map((p) => ({
                                        productId: p.id,
                                        variantId: p.variants[0]?.id || null,
                                    })),
                                };

                                await post(endpoints.removeOrderedFromCart, removePayload);

                                if (codOnlyProducts.length > 0) {
                                    toast.info(
                                        "Some products remain in your cart (not eligible for Online/Wallet Payment). You can purchase them with Cash on Delivery."
                                    );
                                }

                                navigate("/thankyou"); // ✅ navigate ONLY after everything is done
                            } else {
                                toast.error("Payment verification failed.");
                            }
                        } catch (err) {
                            console.error("Verification error:", err);
                            toast.error("Error verifying payment. Please check order status.");
                        }
                    },
                    prefill: {
                        name: user?.fullName || "Customer Name",
                        email: user?.email || "customer@example.com",
                        contact: user?.phoneNo || "9999999999",
                    },
                    theme: { color: "#8A2BE2" },

                    // ✅ Close hone par cancel API call
                    modal: {
                        ondismiss: async function () {
                            try {
                                await post(endpoints.cancelUnpaidOrder, {
                                    userId: Number(userId),
                                    orderId: orderResponse.orderId,
                                });
                                toast.info("Order cancelled as payment was not completed.");
                            } catch (err) {
                                console.error("Cancel unpaid order error:", err);
                                toast.error("Failed to cancel unpaid order.");
                            }
                        }
                    }
                };

                const rzp = new window.Razorpay(razorpayOptions);

                rzp.on("payment.failed", function (response) {
                    toast.error("Payment failed. Please try again.");
                    console.error("Payment failed:", response);
                });

                rzp.open();
            }







            if (paymentMethod === "online") {
                const isScriptLoaded = await loadRazorpayScript();
                if (!isScriptLoaded) {
                    toast.error("Razorpay SDK failed to load.");
                    return;
                }

                const onlineProducts = productData.filter(
                    (item) => item?.paymentOptions && item.paymentOptions.includes("online")
                );

                const codOnlyProducts = productData.filter(
                    (item) => !item?.paymentOptions || !item.paymentOptions.includes("online")
                );

                console.log("Online Products =>", onlineProducts);
                console.log("COD Only Products (not ordered) =>", codOnlyProducts);

                if (onlineProducts.length === 0) {
                    toast.error("No valid products available for Online Payment.");
                    return;
                }

                const orderResponse = await post(endpoints.createOrder, {
                    userId: Number(userId),
                    shippingAddressId,
                    isCoin: isCoin,
                    couponCode: couponCode || coupon || null,
                    items: onlineProducts.map((p) => {
                        const cartItem = cartItems.find(ci => ci.cartProduct?.id === p.id);
                        return {
                            productId: p.id,
                            variantId: p.variants[0]?.id || null,
                            quantity: cartItem?.quantity || 1,
                            price: p.variants[0]?.price || p.price,
                        };
                    }),
                    amount: onlineProducts.reduce((sum, p) => {
                        const cartItem = cartItems.find(ci => ci.cartProduct?.id === p.id);
                        return sum + ((p.variants[0]?.price || p.price) * (cartItem?.quantity || 1));
                    }, 0),

                    paymentMethod: "online",
                });

                if (!orderResponse.status) {
                    toast.error(orderResponse.message || "Failed to initiate payment.");
                    return;
                }

                const razorpayOptions = {
                    key: orderResponse.razorpayKeyId,
                    amount: orderResponse.amount, // must be in paise
                    currency: "INR",
                    name: "Your Store",
                    order_id: orderResponse.razorpayOrderId,
                    handler: async function (razorpayResponse) {
                        try {
                            const verifyResponse = await post(endpoints.verifyRazorpayPayment, {
                                razorpayOrderId: razorpayResponse.razorpay_order_id,
                                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                                razorpaySignature: razorpayResponse.razorpay_signature,
                                orderId: orderResponse.orderId,
                            });

                            if (verifyResponse.status) {
                                toast.success("Payment successful and order placed!");

                                // ✅ Customizations only for ordered products
                                try {
                                    const customizations =
                                        JSON.parse(localStorage.getItem("customizations")) || [];

                                    if (customizations.length > 0) {
                                        const orderItems = onlineProducts.map((p) => ({
                                            productId: p.id,
                                            variantId: p.variants[0]?.id || null,
                                        }));

                                        for (const item of customizations) {
                                            const isProductInOrder = orderItems.some(
                                                (orderItem) => orderItem.productId === item.productId
                                            );

                                            if (isProductInOrder) {
                                                const customPayload = {
                                                    orderId: orderResponse.orderId,
                                                    productId: item.productId,
                                                    customData: item.inputs,
                                                };

                                                await post(endpoints.addOrderCustomisation, customPayload);
                                            }
                                        }

                                        localStorage.removeItem("customizations");
                                    }
                                } catch (err) {
                                    console.error("Error while saving customization:", err);
                                }

                                // ✅ Sirf ordered online products cart se hatana
                                const removePayload = {
                                    userId: userId,
                                    orderedItems: onlineProducts.map((p) => ({
                                        productId: p.id,
                                        variantId: p.variants[0]?.id || null,
                                    })),
                                };

                                await post(endpoints.removeOrderedFromCart, removePayload);

                                if (codOnlyProducts.length > 0) {
                                    toast.info(
                                        "Some products remain in your cart (not eligible for Online Payment). You can purchase them with Cash on Delivery."
                                    );
                                }

                                navigate("/thankyou");
                            } else {
                                toast.error("Payment verification failed.");
                            }
                        } catch (err) {
                            console.error("Verification error:", err);
                            toast.error("Error verifying payment. Please check order status.");
                        }
                    },
                    prefill: {
                        name: user?.fullName || "Customer Name",
                        email: user?.email || "customer@example.com",
                        contact: user?.phoneNo || "9999999999",
                    },
                    theme: { color: "#8A2BE2" },

                    // ✅ Close hone par cancel API call
                    modal: {
                        ondismiss: async function () {
                            try {
                                const cancelRes = await post(endpoints.cancelUnpaidOrder, {
                                    userId: Number(userId),
                                    orderId: orderResponse.orderId,
                                });
                                console.log("Cancel API response =>", cancelRes);
                                toast.info("Order cancelled as payment was not completed.");
                            } catch (err) {
                                console.error("Cancel unpaid order error:", err);
                                toast.error("Failed to cancel unpaid order.");
                            }
                        }
                    }
                };

                const rzp = new window.Razorpay(razorpayOptions);

                rzp.on("payment.failed", function (response) {
                    toast.error("Payment failed. Please try again.");
                    console.error("Payment failed:", response);
                });

                rzp.open();
            }







        } catch (error) {
            console.error("Order Error:", error);
            toast.error("Something went wrong during order placement.");
        }
    };

    const clearCart = async () => {
        try {
            for (const item of cartItems) {
                await del(`${endpoints.removeCartItem}/${item.id}`);
            }
            console.log("All items removed from cart.");
        } catch (error) {
            console.error("Error clearing cart", error);
        }
    };


    const handleCoupon = async () => {
        const payload = {
            userId,
            code: coupon,
            totalAmount: total,
            cartItems: cartItems
        };
        try {
            const response = await post(endpoints.applyCoupon, payload);
            toast.success(response.message || "Coupon applied successfully");
            // setCouponDiscount(parseFloat(response.discount || 0));
            // setFinalTotal(parseFloat(response.finalAmount || total));
            // setCouponId(response.couponId || null);
            handleCheckoutSummary();
            setIsOpen(false)

        } catch (error) {
            toast.error(error.message || "Invalid coupon");
        }
    };














    return (
        <>

            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
                {/* Page Heading */}
                {/* <h2 className="text-3xl font-extrabold mb-10 text-gray-900 tracking-tight">
                    Checkout
                </h2> */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT SECTION */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Cart Review */}
                        {/* Cart Review */}

                        <div className="bg-white border rounded-lg p-6 ">
                            <h3 className="text-lg font-semibold mb-4">Review Your Cart</h3>

                            <div className="space-y-4">
                                {cartItems?.map((item, index) => {
                                    // console.log(item)
                                    const variant = item?.variant;
                                    const imageUrl =
                                        variant?.variantImages?.[0] || "https://via.placeholder.com/150";
                                    const discountedPrice =
                                        variant?.price - (variant?.price * variant?.discountPercent) / 100;

                                    // ✅ Product find
                                    const product = productData?.find(
                                        (p) => String(p?.id) === String(item?.productId)
                                    );

                                    // ✅ Matched Customization
                                    const matchedCustomization = customization?.find(
                                        (c) => String(c?.variantId) === String(variant?.id)
                                    );

                                    // ✅ Disable condition
                                    const isDisabled =
                                        paymentMethod &&
                                        Array.isArray(product?.paymentOptions) &&
                                        !product.paymentOptions.includes(paymentMethod);

                                    return (
                                        <div
                                            key={index}
                                            className={`flex flex-row items-start sm:items-center gap-4 border rounded-lg p-4 bg-gray-50 transition
    ${isDisabled ? "opacity-50 pointer-events-none" : "hover:shadow-md"}
  `}
                                        >
                                            {/* Product Image */}
                                            <img
                                                src={imageUrl}
                                                alt={product?.title}
                                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border flex-shrink-0"
                                            />

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <p className="font-bold text-[13px] mb-0 satosi_bold" style={{ fontWeight: "700" }}>
                                                    {product?.brand || ""}
                                                </p>
                                                <p className="text-gray-700 text-[14px] font-bold satosi_light line-clamp-1 mb-0">
                                                    {variant?.variantName}
                                                </p>

                                                <div className="text-gray-700 grid grid-cols-3 gap-x-2 mb-0 mt-0 py-0 text-xs sm:text-sm">
                                                    <p className="text-sm text-gray-500">Size: {variant?.size}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item?.quantity}</p>
                                                </div>

                                                {/* ✅ Customization */}
                                                {matchedCustomization && (
                                                    <div>
                                                        <span className="inline-block bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full mb-0">
                                                            Customize
                                                        </span>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500">
                                                            {Object.entries(matchedCustomization?.inputs || {}).map(([key, value]) => (
                                                                <p key={key}>
                                                                    {key}: <span>{String(value)}</span>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Price Section */}
                                                <div className="flex items-center  gap-2 mt-1">
                                                    {variant?.discountPercent > 0 ? (
                                                        <div className="flex flex-row sm:flex-row sm:items-center gap-1 -mt-2 sm:mt-0 sm:gap-3">
                                                            <p className="font-bold text-sm text-green-700">
                                                                Rs.
                                                                {(item.priceAtTheTime * item.quantity * (1 - variant.discountPercent / 100)).toFixed(2)}
                                                            </p>
                                                            <p className="text-gray-500 line-through text-sm">
                                                                Rs.{(item.priceAtTheTime * item.quantity).toFixed(2)}
                                                            </p>
                                                            <span className="text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                                -{variant.discountPercent}% OFF
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="font-bold text-sm">
                                                            Rs.{(item.priceAtTheTime * item.quantity).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Return Policy */}
                                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                                    <FaUndoAlt className="text-blue-500 text-base flex-shrink-0" />
                                                    <span className="leading-none">
                                                        {item?.cartProduct?.returnPolicy || "No return policy"}
                                                    </span>
                                                </div>

                                                {/* Disabled Badge */}
                                                {isDisabled && (
                                                    <p className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
                                                        Not available for{" "}
                                                        {paymentMethod === "wallet+online" ? "WALLET" : paymentMethod?.toUpperCase()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                    );
                                })}
                            </div>
                        </div>





                        {/* Shipping & Billing Address */}
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Shipping & Billing Address
                            </h3>
                            <div className="space-y-4">
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        onClick={() => {
                                            setShippingAddressId(addr.id);
                                            setShowNewAddress(false);
                                        }}
                                        className={`flex items-start justify-between gap-3 border rounded-lg p-4 transition cursor-pointer ${shippingAddressId === addr.id
                                            ? "border-pink-500 bg-pink-50"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 flex-1 cursor-pointer">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{addr.fullName}</p>
                                                <p className="text-gray-600">
                                                    {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                                                </p>
                                                <p className="text-gray-600">{addr.phoneNumber}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-500 hover:text-blue-600 transition"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAddress(addr);
                                                }}
                                                title="Edit Address"
                                            >
                                                <FaEdit size={16} />
                                            </button>

                                            <button
                                                className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-500 hover:text-red-600 transition"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(addr.id);
                                                }}
                                                title="Delete Address"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>

                                    </div>
                                ))}

                                {/* Add New Address */}
                                <div
                                    onClick={() => setShowNewAddress(true)}
                                    className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${showNewAddress ? "border-pink-500 bg-pink-50" : "bg-gray-50 hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="text-sm font-medium">+ Add New Address</span>
                                </div>

                                {/* {showNewAddress && (
                                    <div className="mt-4 space-y-3">
                                        <form className="space-y-3">
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="border rounded-md p-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                    value={newAddress.fullName}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, fullName: e.target.value })
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Phone Number"
                                                    className="border rounded-md p-2 mb-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                    value={newAddress.phoneNumber}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, phoneNumber: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Address Line 1"
                                                className="border rounded-md p-2 mb-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                value={newAddress.addressLine1}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, addressLine1: e.target.value })
                                                }
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address Line 2"
                                                className="border rounded-md p-2 mb-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                value={newAddress.addressLine2}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, addressLine2: e.target.value })
                                                }
                                            />
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    className="border rounded-md p-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                    value={newAddress.city}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, city: e.target.value })
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State"
                                                    className="border rounded-md p-2 w-full text-sm  mb-2 focus:ring-1 focus:ring-pink-500"
                                                    value={newAddress.state}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, state: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Postal Code"
                                                    className="border rounded-md p-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                    value={newAddress.postalCode}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, postalCode: e.target.value })
                                                    }
                                                />
                                                <select
                                                    className="border rounded-md p-2 w-full text-sm focus:ring-1 focus:ring-pink-500"
                                                    value={newAddress.type}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, type: e.target.value })
                                                    }
                                                >
                                                    <option value="home">Home</option>
                                                    <option value="work">Work</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <button
                                                className="mt-3 w-full button text-white py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition"
                                                onClick={saveAddress}
                                            >
                                                Save Address
                                            </button>
                                        </form>
                                    </div>
                                )} */}
                                <AddressForm
                                    showNewAddress={showNewAddress}
                                    setShowNewAddress={setShowNewAddress}
                                    fetchAddresses={fetchAddresses}
                                    userId={userId}
                                    saveAddress={saveAddress}
                                    editingAddress={editingAddress}
                                    setEditingAddress={setEditingAddress}

                                />
                            </div>
                        </div>


                        {/* Payment Section */}
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Payment & Final Review</h3>

                            <div className="space-y-3">
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {["cod", "online", "wallet+online"].map((method) => (
                                        <label
                                            key={method}
                                            className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:border-pink-500"
                                        >
                                            <input
                                                type="radio"
                                                value={method}
                                                name="paymentMethod"
                                                checked={paymentMethod === method}
                                                onChange={() => setPaymentMethod(method)}
                                                className="accent-pink-600"
                                            />
                                            <span className="text-sm">
                                                {method === "cod"
                                                    ? "Cash on Delivery"
                                                    : method === "online"
                                                        ? "Pay Online"
                                                        : "Wallet"}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {coins && coins.balance > 0 && (
                                    <div className="flex items-center justify-between border rounded-md p-3 bg-gray-50">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="useCoins"
                                                checked={isCoin}
                                                onChange={() => setIsCoin(!isCoin)}
                                                className="accent-pink-600"
                                            />
                                            <label htmlFor="useCoins" className="text-sm font-medium text-gray-800 cursor-pointer">
                                                Use Coins
                                            </label>
                                        </div>
                                        <span className="text-xs font-semibold text-purple">
                                            Balance: {coins.balance}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={placeOrder}
                                    className="button text-white px-6 py-3 rounded-md w-full font-medium hover:bg-pink-700 transition"
                                >
                                    Place Order →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION - Order Summary */}
                    {checkoutSummary ? (<>

                        <div className="bg-white border rounded-lg p-6 h-fit">
                            <p className="text-sm mb-1 text-gray-700">Coupon</p>

                            <div className="mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-100 p-2 rounded-xl">

                                <input
                                    type="text"
                                    placeholder="Add promo code"
                                    className="flex-1 bg-transparent outline-none px-3 py-2 text-sm w-full"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                />
                                <button
                                    className="button text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
                                    onClick={handleCoupon}
                                    disabled={!coupon.trim()}
                                >
                                    Apply
                                </button>
                            </div>
                            <p className="text-xl satosi_bold font-semibold mb-2 mt-2">Order Summary</p>
                            <div className="space-y-2 text-sm">

                                <div className="flex justify-between text-gray-700">
                                    <span>Original Price</span>
                                    <span>
                                        ₹
                                        {checkoutSummary?.items
                                            ?.reduce((total, item) => total + Number(item.basePrice || 0), 0)
                                            .toFixed(2)}
                                    </span>

                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Product Discount</span>
                                    <span className="text-green-600">
                                        -₹
                                        {checkoutSummary?.items
                                            ?.reduce(
                                                (total, item) =>
                                                    total + (Number(item.basePrice || 0) * Number(item.discountPercent || 0)) / 100,
                                                0
                                            )
                                            .toFixed(2)}
                                    </span>


                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>₹{checkoutSummary?.totalAmount}</span>
                                </div>
                                {parseFloat(checkoutSummary?.discount) > 0 && (
                                    <div className="flex justify-between text-gray-700">
                                        <span>Coupon Discount</span>
                                        <span className="text-green-600">-₹{parseFloat(checkoutSummary?.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping Charges</span>
                                    <span>₹{checkoutSummary?.shippingFee}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Coupon Code</span>
                                    <span onClick={() => setIsOpen(true)} className="text-sm text-purple cursor-pointer">Apply Coupon</span>
                                </div>
                                {/* <button
                                    onClick={() => setIsOpen(true)}
                                    className=" underline text-purple-500  rounded-lg shadow "
                                >
                                    Apply Coupon
                                </button> */}
                                {/* <div className="flex justify-between text-gray-600 ">
                                    <span>Final Amount</span>
                                    <span className="text-gray-600">₹{checkoutSummary?.finalAmount}</span>
                                </div> */}
                                <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
                                    <span>Payable Amount</span>
                                    <span className="text-black">₹{checkoutSummary?.finalAmount}</span>
                                </div>

                                {checkoutSummary?.prepaidDiscount > 0 && (
                                    <div className="mt-2 inline-flex items-center  p-2 w-full rounded-md  bg-green-100 shadow-sm">
                                        <p className="text-green-700 font-medium text-lg m-0" style={{ fontWeight: "700" }}>
                                            Save <span className="font-bold">₹{checkoutSummary.prepaidDiscount}</span> by paying online!
                                        </p>
                                    </div>
                                )}






                            </div>
                        </div>
                    </>) :
                        <div className="bg-white border rounded-lg p-6 h-fit">
                            <p className="text-lg satosi_bold font-semibold mb-2">Order Summary</p>
                            <div className="space-y-2 text-sm">

                                {/* Original Price (Total MRP before discount) */}
                                <div className="flex justify-between text-gray-700">
                                    <span>Original Price</span>
                                    <span>
                                        ₹
                                        {cartItems
                                            .reduce((acc, item) => acc + item.priceAtTheTime * item.quantity, 0)
                                            .toFixed(2)}
                                    </span>
                                </div>

                                {/* Discounted Price (if any product has discount) */}
                                <div className="flex justify-between text-gray-700">
                                    <span>Products Discount</span>
                                    <span className="text-green-600">
                                        -₹
                                        {cartItems
                                            .reduce(
                                                (acc, item) =>
                                                    acc +
                                                    item.priceAtTheTime * item.quantity -
                                                    item.priceAtTheTime *
                                                    item.quantity *
                                                    (1 - item?.variant?.discountPercent / 100),
                                                0
                                            )
                                            .toFixed(2)}
                                    </span>
                                </div>

                                {/* Subtotal */}
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>

                                {/* Coupon Discount */}
                                {couponDiscount ? (
                                    <div className="flex justify-between text-red-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{couponDiscount.toFixed(2)}</span>
                                    </div>
                                ) : null}




                                {/* Final Total */}
                                <div className="border-t pt-4 flex justify-between text-lg font-semibold satosi_bold">
                                    <span>Payable Amount</span>
                                    <span className="text-black">
                                        ₹
                                        {finalTotal
                                            ? finalTotal.toFixed(2)
                                            : (subtotal - (couponDiscount || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    }


                    {isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
                                <h2 className="text-lg font-semibold mb-4">Apply Coupon</h2>

                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCoupon}
                                        className="px-4 py-2 button text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* <div className="bg-white border rounded-lg p-6 h-fit">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>₹{checkoutSummary?.totalAmount}</span>
                            </div>
                            {parseFloat(checkoutSummary?.discount) > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Coupon Discount</span>
                                    <span>-₹{parseFloat(checkoutSummary?.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span>₹{checkoutSummary?.shippingFee}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
                                <span>Total</span>
                                <span>₹{checkoutSummary?.finalAmount}</span>
                            </div>
                            {checkoutSummary?.prepaidDiscount > 0 && (
                                <p className="text-xs font-medium text-purple mt-2">
                                    Save <span className="font-bold">₹{checkoutSummary.prepaidDiscount}</span> by paying online!
                                </p>
                            )}
                        </div>
                    </div> */}
                </div>
            </div>




        </>
    );
};

export default Checkout;
