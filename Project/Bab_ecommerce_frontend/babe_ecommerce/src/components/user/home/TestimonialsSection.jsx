import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaStar, FaRegStar } from "react-icons/fa";
import NewsLetter from "../newsletter/NewsLetter";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const TestimonialsSection = () => {
  const { get } = useApi();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await get(endpoints.getApprovedRatings);
      setTestimonials(response.data || []);
    } catch (error) {
      console.log("Error fetching Rating", error);
    }
  };

  // ✅ Duplicate testimonials only after data is available
  const extendedTestimonials =
    testimonials.length > 0 ? [...testimonials, ...testimonials] : [];

  return (
    <section className="bg-gray-50 py-0 mb-0 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900  ">
            Our Happy Customers
          </h2>
          <p className="mt-2 text-gray-600">
            Real experiences shared by our valuable customers
          </p>
        </div>

        {/* Swiper Testimonials */}
        {extendedTestimonials.length > 0 && (
          <Swiper
            modules={[Pagination, Autoplay]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            // pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="w-full max-w-6xl mx-auto pb-14"
          >
            {extendedTestimonials.map((item, index) => (
              <SwiperSlide key={index} className="transition-all duration-500">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 h-full flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < item.rating ? (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300 mr-1" />
                      )
                    )}
                  </div>

                  {/* Review */}
                  <p className="text-gray-700 italic text-sm leading-relaxed line-clamp-4">
                    "{item.review}"
                  </p>

                  {/* User Info */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {item.user.fullName}
                    </span>
                    <FaCheckCircle className="text-green-500 text-sm" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16">
          <NewsLetter />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
