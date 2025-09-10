import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";

const BlogsPage = () => {
  const { get } = useApi();
  const [blogs, setBlogs] = useState([]);
 
  const navigate = useNavigate();

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await get(`${endpoints.getBlogs}?status=${"published"}`);
      if (response?.data) {
        setBlogs(response.data);
      
      }
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Blog Card
  const BlogCard = ({ blog }) => (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-48 md:h-56 lg:h-64">
        <img
          src={blog.images?.[0] || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        {/* <span className="absolute bottom-0 left-0 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-tr-lg">
          {new Date(blog.createdAt).toLocaleDateString("en-GB")}
        </span> */}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold uppercase text-gray-800 line-clamp-1">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-3 flex-grow">
          {blog.description}
        </p>
        <button
          className="mt-3 text-red-500 font-semibold hover:underline self-start"
          onClick={() => navigate("/blog-details", { state: { id: blog.id } })}
        >
          READ MORE →
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-14 px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">
        ALL BLOGS
      </h2>

      {blogs.length > 0 ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {blogs.map((blog, i) => (
              <BlogCard key={i} blog={blog} />
            ))}
          </div>

         
        </>
      ) : (
        <p className="text-center text-gray-500">No blogs available</p>
      )}
    </div>
  );
};

export default BlogsPage;
