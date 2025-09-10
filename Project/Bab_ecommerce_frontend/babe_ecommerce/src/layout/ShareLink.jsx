import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { FaCheckCircle, FaHeart, FaShoppingBag } from "react-icons/fa";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";

const ShareLink = () => {
    const location = useLocation();

    const [product, setProduct] = useState(null);
    const { get, post } = useApi();
    const userId = Number(localStorage.getItem("userId"));
    const navigate = useNavigate();
    const { slug } = useParams()

    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [variantId, setVariantId] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        fetchProductById();
    }, []);

    const fetchProductById = async () => {
        try {
            const response = await get(`${endpoints.product}/${slug}`);
            const fetchedProduct = response.data;
            console.log(fetchedProduct)
            setProduct(fetchedProduct);

            if (fetchedProduct?.variants?.length > 0) {
                const firstVariant = fetchedProduct.variants[0];
                setSelectedVariant(firstVariant);
                setVariantId(firstVariant.id);
                setSelectedImage(firstVariant.images?.[0] || fetchedProduct.images?.[0]);
                setSelectedColor(firstVariant.color || "");
                setSelectedSize(firstVariant.size || "");
            } else {
                setSelectedImage(fetchedProduct.images?.[0]);
            }
        } catch (error) {
            console.log("Error Fetching Products", error.message);
        }
    };

    const updateVariantBySelection = (newColor, newSize) => {
        if (!product) return;


        const variant = product.variants.find(
            (v) =>
                (newColor ? v.color === newColor : true) &&
                (newSize ? v.size === newSize : true)
        );

        if (variant) {

            setSelectedVariant(variant);
            setVariantId(variant.id);
            setSelectedImage(variant.images?.[0] || product.images?.[0]);
        } else {

            toast.error("Sorry, that size‑color combination is not available.");

            setSelectedVariant(null);
            setVariantId(null);
            setSelectedImage(product.images?.[0]); // fallback to a main image
        }
    };


    const uniqueColors = [
        ...new Set(product?.variants?.map((variant) => variant.color)),
    ];
    const uniqueSizes = [
        ...new Set(product?.variants?.map((variant) => variant.size)),
    ];
    const addToWishList = async (product, e) => {
        e.stopPropagation();
        const payload = {
            userId: localStorage.getItem("userId"),
            productId: product.id,
        };
        try {
            const response = await post(endpoints.addToWishlist, payload);
            toast.success(response.message);
        } catch (error) {
            console.log(error.message);
        }
    };

    const addToCart = async (product) => {
        const payload = {
            userId: userId,
            productId: product.id,
            quantity: quantity,
            variantId: variantId,
        };

        try {
            const res = await post(endpoints.addToCart, payload);
            toast.success(res.message || "Product Added Successfully Go to Cart");
            setTimeout(() => {
                navigate("/cart");
            }, 1000);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const allImages = selectedVariant?.images || product?.images || [];
    const currentImageIndex = allImages.findIndex((img) => img === selectedImage);

    const handleImageNavigation = (direction) => {
        if (!allImages.length) return;

        let newIndex = currentImageIndex;
        if (direction === "prev") {
            newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        } else if (direction === "next") {
            newIndex = (currentImageIndex + 1) % allImages.length;
        }

        setSelectedImage(allImages[newIndex]);
    };


    return (
        <section>

            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                {/* Left Column */}
                {/* Left Column */}
                <div className="flex gap-6">
                    <div className="flex flex-col gap-4">
                        {(selectedVariant?.images || product?.images || []).map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`thumb-${index}`}
                                onClick={() => setSelectedImage(img)}
                                className={`w-20 h-20 rounded-md border object-cover cursor-pointer ${selectedImage === img ? "border-black" : "border-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="relative group">
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-[450px] h-[450px] object-cover rounded-xl border"
                        />

                        {/* Left arrow */}
                        <button
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-xl px-3 py-1 rounded-full shadow-md hidden group-hover:block"
                            onClick={() => handleImageNavigation("prev")}
                        >
                            ‹
                        </button>

                        {/* Right arrow */}
                        <button
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-xl px-3 py-1 rounded-full shadow-md hidden group-hover:block"
                            onClick={() => handleImageNavigation("next")}
                        >
                            ›
                        </button>
                    </div>
                </div>


                {/* Right Column */}
                <div className="space-y-6">
                    {/* Product Title */}
                    <div>
                        <h4 className="text-3xl font-semibold text-gray-900">{product?.title}</h4>
                        <p className="text-gray-500">{product?.description}</p>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center text-sm text-gray-700">
                        <div className="flex items-center gap-2 px-3 py-1 border border-gray-300  shadow-sm">
                            <span className="text-green-600 font-semibold text-base flex items-center gap-1">
                                {product?.averageRating || 0}
                            </span>
                            <span className="text-gray-400 text-base">|</span>
                            <span className="text-gray-700 text-base font-medium">
                                {(product?.totalReviews ?? "18") + " Ratings"}
                            </span>
                        </div>

                    </div>
                    <hr />


                    {/* Price Section */}
                    <div className="flex items-center gap-3 text-xl">
                        {/* Final Price */}
                        <span className="font-bold text-gray-900 text-2xl">
                            ₹{selectedVariant?.price ?? product?.price}
                        </span>

                        {/* MRP + Discount */}
                        {selectedVariant?.discountPercent > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="line-through text-gray-400 text-base">
                                    ₹
                                    {Math.round(
                                        selectedVariant.price / (1 - selectedVariant.discountPercent / 100)
                                    )}
                                </span>
                                <span className="text-orange-600 font-semibold text-sm bg-orange-100 px-2 py-0.5 rounded">
                                    {selectedVariant.discountPercent}% OFF
                                </span>
                            </div>
                        )}
                    </div>


                    <p className="text-green-600 text-sm font-medium">
                        Inclusive of all taxes
                    </p>

                    {/* Color Selector */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 ">SELECT COLOR</p>
                        <div className="flex gap-3">
                            {uniqueColors.map((color) => (
                                <button
                                    key={color}
                                    title={color}
                                    className={`w-9 h-9 border-2 transition-transform duration-200 ease-in-out 
            ${selectedColor === color ? "border-gray-900 scale-110" : "border-gray-300"}`}
                                    style={{
                                        backgroundColor: color.toLowerCase(),
                                        borderRadius: "9999px",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                    }}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        updateVariantBySelection(color, selectedSize);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div>
                        <div className="flex items-center justify-between ">
                            <p className="text-sm font-semibold text-gray-500">SELECT SIZE</p>
                            {/* <span className="text-sm text-pink-600 font-medium cursor-pointer underline">
                SIZE CHART
              </span> */}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {uniqueSizes.map((size) => (
                                <button
                                    key={size}
                                    className={`w-12  h-12 rounded-full border text-sm font-medium transition-all duration-200 
            ${selectedSize === size
                                            ? "bg-purple text-white"
                                            : "text-gray-700 border-gray-300 hover:border-gray-500"
                                        }`}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        updateVariantBySelection(selectedColor, size);
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity & Add to Bag */}
                    <div className="flex items-center gap-5 pt-4">
                        {/* ADD TO CART Button */}
                        <button
                            className="flex items-center gap-2 button text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-pink-700 shadow-md transition"
                            onClick={() =>
                                //  addToCart(product)
                                navigate("/login")
                                }
                        >
                            <FaShoppingBag className="text-base" />
                            ADD TO CART
                        </button>

                        {/* ADD TO WISHLIST Button */}
                        <button
                            className="flex items-center gap-2 border border-gray-300 text-gray-800 text-sm font-semibold px-6 py-3 rounded-full bg-transparent hover:bg-gray-100 transition"
                            onClick={(e) => 
                                // addToWishList(product, e)
                                navigate("/login")

                            }
                        >
                            <FaHeart className="text-base text-purple" />
                            WISHLIST
                        </button>
                    </div>
                    <div className="pt-10 mt-10 border-t border-gray-300 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>

                        {/* Features */}
                        {product?.features && (
                            <div>
                                <h5 className="text-lg font-semibold text-purple mb-2">Features</h5>
                                <div className="flex flex-wrap gap-y-2">
                                    {(product.features)?.map((feature, index) => (
                                        <div key={index} className="w-full sm:w-1/2 flex items-start mb-1">
                                            <FaCheckCircle className="text-green-500 mt-1 mr-2 shrink-0" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        {/* Specifications */}
                        {product?.specifications && (
                            <div>
                                <h5 className="text-lg  text-purple mb-2">Specifications</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                    {Object.entries((product.specifications)).map(([key, value]) => (
                                        <div key={key} className="flex">
                                            <span className="font-medium capitalize w-32">{key}:</span>
                                            <span className="ml-2">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Warranty */}
                        {product?.warranty && (
                            <div className="bg-gray-50 rounded-xl   ">
                                <h5 className="text-lg font-semibold text-purple mb-1">Warranty</h5>
                                <p className="text-sm text-gray-700">{product.warranty.trim()}</p>
                            </div>
                        )}

                        {/* Return Policy */}
                        {product?.returnPolicy && (
                            <div className="bg-gray-50 rounded-xl  ">
                                <h5 className="text-lg font-semibold text-purple mb-1">Return Policy</h5>
                                <p className="text-sm text-gray-700">{product.returnPolicy.trim()}</p>
                            </div>
                        )}

                        {/* Shipping Info */}
                        {product?.shippingInfo && (
                            <div className="bg-gray-50 rounded-xl   ">
                                <h5 className="text-lg font-semibold text-purple mb-1">Shipping Info</h5>
                                <p className="text-sm text-gray-700">{product.shippingInfo.trim()}</p>
                            </div>
                        )}
                    </div>







                </div>


            </div>


        </section>
    );
};

export default ShareLink;
