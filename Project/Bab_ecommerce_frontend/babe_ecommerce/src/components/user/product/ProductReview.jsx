import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { useLocation } from "react-router-dom";
import { FaStar, FaCogs, FaFolderOpen, FaShieldAlt, FaUndo, FaTruck } from "react-icons/fa";
import Faq from "../pages/Faq";
import EmptyReview from "../pages/EmptyReview";



const ProductReview = () => {
  const [activeTab, setActiveTab] = useState("Rating & Reviews");
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { post, get,patch } = useApi();
  const { state } = useLocation()
  const productId = state?.productId
  const [review, setReview] = useState([])
  const [product, setProduct] = useState(null)
  const [reviewImage, setReviewImage] = useState(null)
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showFaqModel, setShowFaqModel] = useState(false)
  const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [editFaqId, setEditFaqId] = useState(null);

const [variantId, setVariantId] = useState("");
const [isActive, setIsActive] = useState(true);
const userType=localStorage.getItem("userType")

const [faq,setFaq]=useState([])



  useEffect(() => {
    fectchReview();
    fetchProductById()
    fectchFaq()
  }, [])

  const fectchReview = async () => {
    try {
      const response = await get(`${endpoints.getReviewsByProduct}/${productId}`);
      setReview(response.data || [])

    } catch (error) {
      console.log("Error for Fetching Review")
    }
  }

  const fectchFaq = async () => {
    try {
      const response = await get(`${endpoints.getFAQs}?productId=${productId}`);
      setFaq(response.data || [])

    } catch (error) {
      console.log("Error for Fetching Review")
    }
  }


  const fetchProductById = async () => {
    try {
      const response = await get(`${endpoints.getProductById}/${productId}`);
      setProduct(response.data || {})


    } catch (error) {
      console.log("Error for Fetching Product By Id")
    }
  }



  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("userId", localStorage.getItem("userId"));
      if (reviewImage) {
        formData.append("reviewImage", reviewImage);
      }
      if (isEditing && selectedReviewId) {
        formData.append("reviewId", selectedReviewId); // 👈 Pass review ID to update
      }

      const res = await post(endpoints.addOrUpdateReview, formData);
      toast.success(res.message || "Review submitted successfully!");

      // Reset state
      setShowModal(false);
      setRating(0);
      setComment("");
      setReviewImage(null);
      setIsEditing(false);
      setSelectedReviewId(null);

      fectchReview();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleFaqSubmit = async () => {
  const faqData = {
    question,
    productId: parseInt(productId),
  
    isActive:true,
  };

  // 👇 ye function add karo



  try {
    if (isEditing && editFaqId) {
      // Update FAQ
      await patch(`${endpoints.updateFAQ}/${editFaqId}`, faqData);
     toast.success("FAQ updated successfully");
    } else {
      // Add new FAQ
      await post(endpoints.createFAQ, faqData);
      toast.success("FAQ created successfully");
    }

    // Clear fields and close modal
    setQuestion("");
    setAnswer("");
    
    setVariantId("");
    setIsActive(true);
    setIsEditing(false);
    setEditFaqId(null);
    setShowFaqModel(false);
  } catch (error) {
    console.error("Error submitting FAQ:", error);
  }
};

const handleOpenReviewModal = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (userType !=="user") {
      toast.error("Please login to write a review.");
      return;
    }

    const res = await post(endpoints.canUserRate, {
      userId,
      productId,
    });

    if (res?.status) {
      // agar backend se canRate true aaye
      setShowModal(true);
    } else {
      // agar user review nahi de sakta
      toast.error(res?.message || "You cannot rate this product.");
    }
  } catch (error) {
    console.error("Error checking canUserRate:", error);
    // toast.error("Something went wrong. Please try again.");
  }
};



  const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Tabs Header */}
      <div className="flex w-full gap-6 mb-8 satosi_bold">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium flex-1 text-center ${activeTab === tab
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Product Details" && product && (
        <div className="text-gray-800 text-sm leading-relaxed space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

          {/* Title and Brand */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h2>
            <p className="text-gray-500 text-sm">
              by <span className="font-semibold">{product.brand}</span>
            </p>
          </div>

          {/* Price & Discount */}
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold text-gray-900">₹{product.price}</p>
            {product.discountPercent > 0 && (
              <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-sm">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Features */}
          {product.features && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-700">
                <FaStar className="text-yellow-500" /> Features
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
                {(product.features).map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-700">
                <FaCogs className="text-gray-600" /> Specifications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                {Object.entries((product.specifications)).map(
                  ([key, value]) => (
                    <li key={key} className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{value}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Category */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-700">
              <FaFolderOpen className="text-gray-500" /> Category
            </h3>
            <p className="text-sm text-gray-700 capitalize">{product.category?.name}</p>
          </div>

          {/* Warranty, Return, Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Warranty */}
            <div className="bg-gray-50 hover:shadow-md transition p-5 rounded-xl">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-600">
                <FaShieldAlt /> Warranty
              </h4>
              <p className="text-sm text-gray-700">
                {product.warranty || "No warranty"}
              </p>
            </div>

            {/* Return Policy */}
            <div className="bg-gray-50 hover:shadow-md transition p-5 rounded-xl">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-500">
                <FaUndo /> Return Policy
              </h4>
              <p className="text-sm text-gray-700">{product.returnPolicy}</p>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 hover:shadow-md transition p-5 rounded-xl">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                <FaTruck /> Shipping Info
              </h4>
              <p className="text-sm text-gray-700">{product.shippingInfo}</p>
            </div>
          </div>
        </div>
      )}




      {activeTab === "Rating & Reviews" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold satosi_bold">
              All Reviews
            </h2>
            <div className="flex gap-3">
              {/* <button className="border px-4 py-2 rounded-full text-sm">
                Latest
              </button> */}
              <button
                className="button text-white px-4 py-2 rounded-full text-sm"
                onClick={handleOpenReviewModal}
              >
                Write a Review
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 satosi_light">
            {review.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-gray-50 rounded-xl shadow">
                 <EmptyReview/>
              </div>
             
            ) : (
              review.map((review, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 border p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-300"
                >
                  {/* Review Image */}
                  {review?.reviewImage && (
                    <div className="sm:w-1/3 w-full">
                      <img
                        src={review.reviewImage}
                        alt="Review"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Review Content */}
                  <div className="flex-1 space-y-2">
                    {/* Rating and Menu Icon */}
                    <div className="flex justify-between items-center">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                      <i className="fas fa-ellipsis-h text-gray-400"></i>
                    </div>

                    {/* Reviewer Name */}
                    <p className="font-semibold flex items-center gap-2">
                      {review.user?.fullName || "Anonymous"}
                      <span className="text-green-500 text-sm">
                        <i className="fas fa-check-circle"></i>
                      </span>
                    </p>

                    {/* Comment */}
                    <p className="text-gray-700 text-sm leading-relaxed">"{review.comment}"</p>

                    {/* Date */}
                    <p className="text-gray-400 text-xs">
                      Posted on {new Date(review.createdAt).toLocaleDateString()}
                    </p>

                    {/* Edit Button (Conditional) */}


                    {review.userId == localStorage.getItem("userId") && (
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setIsEditing(true);
                          setSelectedReviewId(review.id);
                          setRating(review.rating);
                          setComment(review.comment);
                          setReviewImage(null); // Optional: clear old image unless re-uploaded
                        }}
                        className="text-sm text-blue-600 "
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>


              ))
            )}
          </div>


          <div className="mt-8 text-center">
            {/* <button className="border px-6 py-2 rounded-full text-sm hover:bg-gray-100">
              Load More Reviews
            </button> */}
          </div>

        </>
      )}

      {activeTab === "FAQs" && (
        <div className="space-y-6 text-gray-800 text-sm sm:text-base">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
    {/* <button
      onClick={() => setShowFaqModel(true)}
      className=" button text-white px-4 py-2 rounded-lg shadow transition duration-200"
    >
      Ask Something
    </button> */}
  </div>

  {/* FAQ Item */}
  {
  // [
  //   {
  //     question: "Is the t-shirt machine washable?",
  //     answer: "✅ Yes, it is completely machine washable.",
  //   },
  //   {
  //     question: "Will the color fade over time?",
  //     answer: "✅ No, it’s made with color-fast fabric that lasts long.",
  //   },
  //   {
  //     question: "Is it available in plus sizes?",
  //     answer: "✅ Yes, we have options up to 3XL.",
  //   },
  // ]
  
  faq.length===0?(<Faq/>):faq.map((faq, index) => (
    <div
      key={index}
      className="bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-200"
    >
      <div className="flex items-start gap-3 mb-1">
        <i className="fas fa-question-circle text-blue-500 text-lg mt-1" />
        <p className="font-semibold text-gray-900">{faq.question}</p>
      </div>
      <p className="text-gray-600 pl-8">{faq.answer}</p>
    </div>
  ))}
</div>

      )}


      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50  flex items-center justify-center" style={{ backdropFilter: "blur(20px)" }}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

            <label className="block mb-2 text-sm">Rating:</label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  ★
                </button>
              ))}
            </div>
            <lable className="block mb-2 text-sm">Upload Image</lable>
            <input type="file" className="w-full border p-2" onChange={(e) => {
              setReviewImage(e.target.files[0])
            }} />

            <label className="block mb-2 text-sm">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md mb-4 text-sm"
              placeholder="Share your thoughts..."
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-full"

              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 text-sm button text-white rounded-full"
              >
                {isEditing ? "Update Review" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showFaqModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Add FAQ</h2>

            <label className="block mb-2 text-sm">Question:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-sm"
              placeholder="Enter question..."
            />

         

          

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFaqModel(false)}
                className="px-4 py-2 text-sm border rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleFaqSubmit}
                className="px-4 py-2 text-sm button text-white rounded-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductReview;
