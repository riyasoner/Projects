import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function BrowseByStyle() {
  const { get } = useApi();
  const [mainCategories, setMainCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await get(endpoints.getAllMainCategories);
      setMainCategories(response.data);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  return (
<section className="py-2">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-left">
      Shop By Category
    </h2>

    {/* Grid Layout Instead of Swiper */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6  gap-6 ">
      {mainCategories.flatMap((main) =>
        main.categories?.map((cat) => (
          <Link
            key={`${main.id}-${cat.id}`}
            to="/product_list"
            state={{ categoryId: cat.id }}
            style={{ textDecoration: "none" }}
            className="bg-[#F1CD4D] shadow-md hover:shadow-lg transition p-2 flex flex-col items-center text-center"
          >
            {/* Rectangular Image */}
            <div className="w-full h-40 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-sm"
              />
            </div>

            {/* Category Name + Discount */}
            <div className="mt-2">
              <span className="block text-base  text-black font-bold line-clamp-1">
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </span>
              <span className="text-xl font-extrabold text-black">
                {cat.discount || "UP TO 70% OFF"}
              </span>
              <span className="block text-xs font-bold text-black">Shop Now</span>
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
</section>

  );
}

export default BrowseByStyle;
