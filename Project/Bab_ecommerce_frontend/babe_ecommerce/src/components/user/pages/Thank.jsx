import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

import endpoints from "../../../api/endpoints";
import useApi from "../../../hooks/useApi";
import { toast } from "react-toastify";

const Thank = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { post, get } = useApi()
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await get(endpoints.getAllRatings);

        if (response?.status && response?.data?.length > 0) {
          // Check if user has already submitted a rating
          const userAlreadyRated = response.data.some(
            (rating) => rating.userId == userId
          );

          // Only show popup if user has NOT rated
          if (!userAlreadyRated) {
            setTimeout(() => {
              setShowPopup(true);
            }, 1000); // delay to show popup after 1s
          }
        } else {
          // No ratings found, safe to show popup
          setTimeout(() => {
            setShowPopup(true);
          }, 1000);
        }
      } catch (error) {
        console.log("Error fetching ratings:", error);
      }
    };

    fetchRating();
  }, [userId]);


  const handleSubmit = async () => {
    const payload = {
      rating: rating,
      review: review,
      userId: userId
    }

    try {
      await post(endpoints.createRating, payload
      );
      toast.success("Thanks for your feedback!");
      setShowPopup(false);
    } catch (err) {
      console.error("Rating submit failed", err);
      // alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8ec5fc] to-[#e0c3fc] px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl max-w-2xl w-full flex flex-col items-center text-center p-10 animate-fade-in-up">
        <img
          src="https://img.freepik.com/free-vector/thank-you-lettering_1262-6963.jpg"
          alt="Success Illustration"
          className="w-52 md:w-60 mb-6"
        />
        {/* <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Thank You!</h1> */}
        <p className="text-gray-600 text-base md:text-lg mb-6">
          We appreciate your order. Your items will be on their way soon. 💖
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Continue Shopping
        </button>
      </div>

      {/* ⭐ Rating Popup */}
      {showPopup && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg border border-gray-200 p-5 text-left animate-fade-in-up">

            <h2 className="text-lg font-semibold text-gray-800 mb-1">Rate Your Experience</h2>
            <p className="text-gray-500 mb-3 text-xs">
              Help us improve by sharing your feedback.
            </p>

            <div className="flex justify-center mb-3">
              <ReactStars
                count={5}
                onChange={(newRating) => setRating(newRating)}
                size={24}
                activeColor="#f59e0b"
              />

            </div>

            <textarea
              placeholder="Write a short review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full h-20 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 rounded-md px-3 py-2 text-xs resize-none placeholder-gray-400 transition"
            ></textarea>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                className="button text-white px-4 py-1.5 text-sm rounded-md font-medium shadow-sm transition"
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

export default Thank;
