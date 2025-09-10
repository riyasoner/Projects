import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FaRegCalendarAlt, FaEye, FaTags, FaLightbulb } from "react-icons/fa";
import Products from "./Products";

function BlogDetails() {
    const { state } = useLocation();
    const id = state?.id;
    const { get } = useApi();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBlog = async () => {
        try {
            const res = await get(`${endpoints.getBlogById}/${id}`);
            setBlog(res?.data || null);
        } catch (error) {
            console.log("Error fetching blog", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-gray-500 text-lg animate-pulse">
                    Loading blog...
                </p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-gray-500 text-lg">Blog not found</p>
            </div>
        );
    }

    return (
        <>
   <div className="max-w-5xl mx-auto px-4 lg:px-6 py-14">
  {/* Blog Title */}
  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
    {blog.title}
  </h1>

  {/* Meta Info */}
  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 border-b pb-3">
    <span className="flex items-center gap-2">
      <FaRegCalendarAlt className="text-red-500" />
      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </span>
    <span className="flex items-center gap-2">
      <FaEye className="text-blue-500" />
      {blog.views} views
    </span>
    {blog.metaKeywords && (
      <span className="flex items-center gap-2">
        <FaTags className="text-green-500" />
        {blog.metaKeywords.split(",").map((tag, i) => (
          <span
            key={i}
            className="bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-xs font-medium"
          >
            {tag.trim()}
          </span>
        ))}
      </span>
    )}
  </div>

  {/* Blog Images */}
  {blog.images?.length > 1 ? (
    <div className="relative group mb-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        className="rounded-2xl shadow-md overflow-hidden"
      >
        {blog.images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`${blog.title} ${idx + 1}`}
              className="w-full h-[460px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button className="custom-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-gray-200 transition opacity-0 group-hover:opacity-100">
        <MdArrowBackIos size={20} />
      </button>
      <button className="custom-next absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-gray-200 transition opacity-0 group-hover:opacity-100">
        <MdArrowForwardIos size={20} />
      </button>
    </div>
  ) : (
    blog.images?.length === 1 && (
      <img
        src={blog.images[0]}
        alt={blog.title}
        className="w-full h-[460px] object-cover rounded-2xl shadow-md mb-10"
      />
    )
  )}

  {/* Blog Content */}

   {blog.excerpt && (
    <div className="mt-12 p-6 bg-gradient-to-r from-red-50 via-white to-gray-50 rounded-xl border-l-4 border-red-500 shadow">
      <p className="italic text-gray-700 text-lg flex items-start gap-2">
        <FaLightbulb className="text-yellow-500 text-xl mt-1" />
        {blog.excerpt}
      </p>
    </div>
  )}

  <article className="prose prose-lg max-w-none mt-5  bg-white text-gray-800 leading-relaxed shadow-xl rounded-2xl p-4">
    <p>{blog.description}</p>
  </article>

  {/* Blog Excerpt / Highlight */}
 
</div>

        <Products categoryId={blog.categoryId}/>
        </>
    );
}

export default BlogDetails;
