import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endpoints';
import { FaArrowLeft } from 'react-icons/fa';

function ViewOrder() {
    const { state } = useLocation();
    const id = state?.id;
    const { get } = useApi();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderById();
    }, []);

    const fetchOrderById = async () => {
        try {
            const response = await get(`${endpoints.getOrderById}/${id}`);
            setOrder(response.data || {});
        } catch (error) {
            console.log('Error fetching order by Id', error);
        }
    };

    if (!order) return <div className="text-center mt-10 text-gray-600">Loading order details...</div>;

    const {
        user,
        shippingAddress,
        totalAmount,
        finalAmount,
        shippingFee,
        paymentStatus,
        paymentMethod,
        orderStatus,
        discount,
        createdAt,
        items
    } = order;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Back Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                    <FaArrowLeft size={14} />
                    Back
                </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8" >
                <h4 className="text-xl  mb-4" >Order Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
                    <p><strong>Shipping Fee:</strong> ₹{shippingFee}</p>
                    <p><strong>Discount:</strong> ₹{discount}</p>
                    <p><strong>Final Amount:</strong> ₹{finalAmount}</p>
                    <p><strong>Payment Status:</strong> {paymentStatus}</p>
                    <p><strong>Payment Method:</strong> {paymentMethod}</p>
                    <p><strong>Order Status:</strong> {orderStatus}</p>
                    <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* User Info */}
            {user && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h4 className="text-2xl font-bold mb-4">User Information</h4>
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}

            {/* Shipping Address */}
            {shippingAddress && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h4 className="text-2xl font-bold mb-4">Shipping Address</h4>
                    <p><strong>Name:</strong> {shippingAddress.fullName}</p>
                    <p><strong>Phone:</strong> {shippingAddress.phoneNumber}</p>
                    <p><strong>Address:</strong> {shippingAddress.addressLine1}, {shippingAddress.addressLine2}, {shippingAddress.landmark}</p>
                    <p><strong>City:</strong> {shippingAddress.city}</p>
                    <p><strong>State:</strong> {shippingAddress.state}</p>
                    <p><strong>Postal Code:</strong> {shippingAddress.postalCode}</p>
                    <p><strong>Country:</strong> {shippingAddress.country}</p>
                    <p><strong>Type:</strong> {shippingAddress.type}</p>
                </div>
            )}

            {/* Ordered Items */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h4 className="text-2xl font-bold mb-4">Ordered Items</h4>
                {items?.map((item, index) => {
                    const { product, variant } = item;
                    return (
                        <div key={index} className="border rounded-xl p-4 mb-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                            <p><strong>Description:</strong> {product.description}</p>
                            <p><strong>Brand:</strong> {product.brand}</p>
                            <p><strong>Original Price:</strong> ₹{product.price}</p>
                            <p><strong>Discount:</strong> {product.discountPercent}%</p>
                            <p><strong>SKU:</strong> {product.sku}</p>
                            <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
                            <p><strong>Shipping Info:</strong> {product.shippingInfo}</p>

                            {/* Features */}
                            {product.features && (
                                <div className="mt-2">
                                    <strong>Features:</strong>
                                    <ul className="list-disc ml-6">
                                        {(product.features)?.map((feat, i) => (
                                            <li key={i}>{feat}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Specifications */}
                            {product.specifications && (
                                <div className="mt-2">
                                    <strong>Specifications:</strong>
                                    <ul className="list-disc ml-6">
                                        {Object.entries((product.specifications)).map(([key, value]) => (
                                            <li key={key}><strong>{key}:</strong> {value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Variant Info */}
                            {variant && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-md font-semibold mb-2">Variant</h4>
                                    <p><strong>Name:</strong> {variant.variantName}</p>
                                    <p><strong>Color:</strong> {variant.color}</p>
                                    <p><strong>Size:</strong> {variant.size}</p>
                                    <p><strong>Price:</strong> ₹{variant.price}</p>
                                    <p><strong>SKU:</strong> {variant.sku}</p>

                                    {/* Variant Images */}
                                    {variant.variantImages?.length > 0 && (
                                        <div className="mt-2 flex gap-3 flex-wrap">
                                            {variant.variantImages.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={`${img}`}
                                                    alt="variant"
                                                    className="w-24 h-24 object-cover rounded border"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ViewOrder;
