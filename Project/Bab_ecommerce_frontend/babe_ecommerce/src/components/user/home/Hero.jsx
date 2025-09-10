import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import endpoints from "../../../api/endpoints";
import useApi from "../../../hooks/useApi";

const slides = [
  {
    id: 1,
    image: "https://images.meesho.com/images/marketing/1746425994914.webp",
    title: "Discover the Latest Collection",
    subtitle: "Trendy. Stylish. Affordable.",
  },
  {
    id: 2,
    image: "https://static.vecteezy.com/system/resources/thumbnails/004/299/835/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg",
    title: "",
    subtitle: "",
  },
  {
    id: 3,
    image: "https://t4.ftcdn.net/jpg/02/49/50/15/360_F_249501541_XmWdfAfUbWAvGxBwAM0ba2aYT36ntlpH.jpg",
    title: "",
    subtitle: "",
  },
];

function Hero() {
  
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const navigate=useNavigate()
  const {get}=useApi()

  const [banner,setBanners]=useState([])

    const fetchBanners = async () => {
        try {
            const response = await get(`${endpoints.getAllBanners}?status=${true}`);
            setBanners(response.banners || []);
        } catch (error) {
            toast.error("Failed to fetch banners");
        }
    };


  useEffect(() => {
    setSwiperReady(true);
    fetchBanners();

  }, []);

  return (
    <>
      {/* 👉 Show only on md+ (tablet and desktop) */}
      <div className="hidden md:block w-full h-[80vh] relative group overflow-hidden">
        {swiperReady && (
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSwiper={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            loop={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="h-full w-full"
          >
            {banner.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="w-full h-full bg-cover bg-center flex items-center justify-end px-6 md:px-16"
                  style={{ backgroundImage: `url(${slide.bannerImage})` }}
                >
                  <div className="text-center text-white max-w-md md:max-w-xl">
                    {/* <h2 className="text-2xl md:text-5xl font-bold drop-shadow-md mb-2 md:mb-4">
                      {slide.title}
                    </h2> */}
                    {/* <p className="text-sm md:text-xl drop-shadow-md custom-swiper">
                      {slide.subtitle}
                    </p> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Arrows */}
        <div
          ref={prevRef}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 text-white text-3xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FaArrowLeft />
        </div>
        <div
          ref={nextRef}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-white text-3xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FaArrowRight />
        </div>
      </div>

      {/* 👉 Show only on mobile */}
      <div
        className="block md:hidden  bg-gradient-to-br text-center py-10 px-4"
        style={{
          backgroundImage:
            'url("https://static.vecteezy.com/system/resources/thumbnails/023/309/702/small/ai-generative-e-commerce-concept-shopping-cart-with-boxes-on-a-wooden-table-photo.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-3">FIND YOUR STYLE</h1>
        <p className="text-sm text-white">
          Browse top picks and shop the latest trends from the best brands.
        </p>
        <button className="mt-4 button px-6 py-2 rounded-full font-semibold shadow-md" onClick={()=>{
          navigate("/product_list")
        }} >
          Shop Now
        </button>
      </div>

    </>
  );
}

export default Hero;
