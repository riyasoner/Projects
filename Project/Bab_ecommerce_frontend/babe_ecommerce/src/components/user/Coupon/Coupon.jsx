import React, { useEffect, useState } from "react";
import { FaCopy, FaTag } from "react-icons/fa";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Coupon() {
    const { get } = useApi();
    const [coupons, setCoupons] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        fetchCoupon();
    }, []);

    const fetchCoupon = async () => {
        try {
            const response = await get(endpoints.getAllCoupons);
            setCoupons(response?.data?.data || []);
        } catch (error) {
            console.log("Error for Fetching Coupon", error);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code "${code}" copied!`);
    };

    const handleViewProducts = (coupon) => {
        let stateData = {};

        switch (coupon.appliedOnType) {
            case "product":
                stateData = { productId: coupon.appliedOnId };
                break;
            case "subCategory":
                stateData = { subCategoryId: coupon.appliedOnId };
                break;
            case "category":
                stateData = { categoryId: coupon.appliedOnId };
                break;
            case "mainCategory":
                stateData = { mainCategoryId: coupon.appliedOnId };
                break;
            case "all":
                // no state required
                navigate("/product_list");
                return;
            default:
                console.warn("Unknown appliedOnType:", coupon.appliedOnType);
                return;
        }

        navigate("/product_list", { state: stateData });
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {coupons.map((coupon) => (
                <div
                    key={coupon.id}
                    className="border rounded-xl shadow-md bg-white p-4 relative"
                >
                    {/* Discount Title */}
                    <div className="flex items-center gap-2 mb-1">
                        {/* <FaTag className="text-red-500 text-xl" /> */}
                        <p className="text-[15px] satosi_bold font-bold text-gray-800 mb-0">
                            {coupon.discountType === "percent"
                                ? `Flat ${coupon.discountValue}% Off`
                                : `Flat ₹${coupon.discountValue} Off`}
                        </p>
                    </div>

                    {/* Min order */}
                    <p className="text-sm text-gray-600 mb-2">
                        Min Order: ₹{coupon.minOrderValue}
                    </p>

                    {/* Coupon Code + Copy */}
                    <div className="flex items-center justify-between border rounded-md p-2 bg-gray-50 mb-3">
                        <span className=" font-mono text-gray-700 ">{coupon.code}</span>
                        <button
                            onClick={() => handleCopy(coupon.code)}
                            className="text-gray-500 hover:text-blue-800 flex items-center gap-1"
                        >
                            <FaCopy />
                        </button>
                    </div>

                    {/* Expiry Date */}
                    <p className="text-sm text-gray-600 mb-3">
                        Expiry:{" "}
                        <span className="text-xs satosi_bold text-black/80">
                            {new Date(coupon.endDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </p>


                    {/* View Products Button */}
                    <button
                        className="w-full button text-white py-2 font-medium transition"
                        style={{ borderRadius: "10px" }}
                        onClick={() => handleViewProducts(coupon)}
                    >
                        View Products
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Coupon;
