import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Navbar from "../../../layout/Navbar";
import Footer from "../../../layout/Footer";
import { useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { toast } from "react-toastify";
import EmptyWishlist from "../pages/EmptyWishlist";
import { confirmAlert } from "react-confirm-alert";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { get, post } = useApi();
  const userId = localStorage.getItem("userId");
  const [quantity, setQuantity] = useState(1)


  const getFirstImage = (product) =>
    product?.images?.length ? product.images[0] : "/placeholder.png";


  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await get(`${endpoints.getWishlistByUser}/${userId}`);
      setWishlist(response.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const payload = { userId, productId };
      const response = await post(endpoints.removeFromWishlist, payload);
      toast.success(response.data);
      fetchWishlist();
    } catch (error) {
      toast.error(error.message);
    }
  };

   const handleDeleteClick = (id) => {
      confirmAlert({
        title: "Confirm Deletion",
        message: "Are you sure you want to Remove this Product ?",
        buttons: [
          {
            label: "Yes",
            onClick: () => handleRemove(id),
          },
          {
            label: "No",
          },
        ],
        overlayClassName: "custom-overlay"
      });
    };
  const addToCart = async (product) => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      navigate("/login"); // login page pe bhej do
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

      // Optionally redirect to cart
      // setTimeout(() => {
      //   navigate("/cart");
      // }, 1500);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };


  const getOldPrice = (p) =>
    p.discountPercent ? (p.price / (1 - p.discountPercent / 100)).toFixed(0) : null;



  return (
    <>


      <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto">
          {wishlist.length > 0 && (
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 ">
              My Wishlist
            </h2>
          )}

          {wishlist.length === 0 ? (

            <EmptyWishlist />

          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {wishlist.map((item) => {
                const { product, productId, id: wishlistId } = item; // eslint-disable-line
                return (
                  <div
                    key={wishlistId}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                    onClick={() =>
                      navigate("/product_page", { state: { productId: product.id } })
                    }
                  >
                    <div className="bg-white p-4">


                      {/* Product image */}
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden">
                        <img
                          src={getFirstImage(product)}
                          alt={product?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>


                      {/* Product content */}
                      <div className="">
                        <div className="px-3 mt-2">
                          <h3 className=" font-bold text-gray-700 mb-1  capitalize" style={{ fontSize: "20px", fontWeight: "700" }}>
                            {product?.title}
                          </h3>
                          <p className="text-gray-700 text-sm line-clamp-1 mb-1 capitalize">
                            {product?.description}
                          </p>


                          <div className="price flex items-center gap-2">
                            {/* Current Price */}
                            <span className="text-sm font-bold text-gray-900 mb-1">
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
                              <span className="text-sm font-semibold " style={{ color: "#FF9E6A" }}>
                                ({Math.round(
                                  ((getOldPrice(product) - product.price) / getOldPrice(product)) * 100
                                )}
                                % OFF)
                              </span>
                            )}
                          </div>
                        </div>


                        {/* Add to Cart */}
                        <div className=" mt-2">

                          {/* Add to Cart button */}
                          {!(product?.stock === 0 || product?.variants?.some((v) => v.stock === 0)) && (
                            <button
                              className="w-full button text-white py-2 rounded-[5px] font-semibold hover:bg-gray-900 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product)

                              }
                              }
                            >
                              Add to Cart
                            </button>
                          )}

                          {/* Out of Stock button */}
                          {(product?.stock === 0 || product?.variants?.some((v) => v.stock === 0)) && (
                            <button
                              className="w-full bg-gray-300 text-gray-600 py-2 rounded-xl font-semibold cursor-not-allowed"
                              disabled
                              style={{ borderRadius: "10px" }}
                            >
                              Out of Stock
                            </button>
                          )}



                          {/* Remove button (inside card) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(productId)
                            }}
                            className="w-full mt-2 py-2 border border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition"
                            style={{ borderRadius: "10px" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


    </>
  );
}

export default Wishlist;
