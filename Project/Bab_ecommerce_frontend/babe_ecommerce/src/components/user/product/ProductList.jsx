import React, { useEffect, useState } from "react";
import Navbar from "../../../layout/Navbar";
import Footer from "../../../layout/Footer";
import FiltersSidebar from "./FiltersSidebar";
import ProductCard from "./ProductCard";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { useLocation } from "react-router-dom";
import EmptyProducts from "../pages/EmptyProducts";

const ProductList = () => {
  const location = useLocation();
  const navbarCategoryId = location.state?.categoryId || "";
  const navbarMainCategoryId = location.state?.mainCategoryId || "";
  const navbarSubCategoryId = location.state?.subCategoryId || "";
  const navbarProductId = location.state?.productId || "";

  const [selectedFilters, setSelectedFilters] = useState({
    sizes: [],
    styles: [],
    colors: [],
    minPrice: "",
    maxPrice: "",
    search: "",
    categoryId: navbarCategoryId,
    subCategoryId: navbarSubCategoryId,
    mainCategoryId: navbarMainCategoryId,
    productId:navbarProductId,
    page: 1,
    price: "",
  });

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [applyTrigger, setApplyTrigger] = useState(false);

  const { get } = useApi();

 const fetchProducts = async () => {
  try {
    const filters = {};

    // Send only if array is not empty
    if (selectedFilters.sizes?.length) {
      filters.size = selectedFilters.sizes.join(",");
    }
    if (selectedFilters.styles?.length) {
      filters.style = selectedFilters.styles.join(",");
    }
    if (selectedFilters.colors?.length) {
      filters.color = selectedFilters.colors.join(",");
    }

    // Send only if value is not null, undefined or empty string
    if (selectedFilters.minPrice !== undefined && selectedFilters.minPrice !== null && selectedFilters.minPrice !== "") {
      filters.minPrice = selectedFilters.minPrice;
    }
    if (selectedFilters.maxPrice !== undefined && selectedFilters.maxPrice !== null && selectedFilters.maxPrice !== "") {
      filters.maxPrice = selectedFilters.maxPrice;
    }

    if (selectedFilters.search?.trim()) {
      filters.search = selectedFilters.search.trim();
    }

    if (selectedFilters.categoryId) {
      filters.categoryId = selectedFilters.categoryId;
    }

    if (selectedFilters.subCategoryId) {
      filters.subCategoryId = selectedFilters.subCategoryId;
    }

    if (selectedFilters.mainCategoryId) {
      filters.mainCategoryId = selectedFilters.mainCategoryId;
    }

    // Page and price usually always needed
    if (selectedFilters.page) {
      filters.page = selectedFilters.page;
    }

    if (selectedFilters.price) {
      filters.price = selectedFilters.price;
    }

    const response = await get(endpoints.getAllProducts, { params: filters });

    setProducts(response.data || []);
    setTotalPages(response.data.totalPages || 1);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};



  // ✅ Run when navbarCategoryId changes (user clicks a category/subcategory link)
  useEffect(() => {
    if (navbarCategoryId) {
      setSelectedFilters((prev) => ({
        ...prev,
        categoryId: navbarCategoryId,
        page: 1,
      }));
    }
  }, [navbarCategoryId]);

  // ✅ Fetch when categoryId or page changes
  useEffect(() => {
    fetchProducts();
  }, [selectedFilters.categoryId, selectedFilters.page]);

  // ✅ Fetch when Apply Filters button is clicked
  useEffect(() => {
    if (applyTrigger) {
      fetchProducts();
      setApplyTrigger(false);
    }
  }, [applyTrigger]);

  return (
  <section>
  <div className="flex flex-col lg:flex-row p-4 gap-4">
    
    {/* Left Sidebar (No Scroll) */}
    <FiltersSidebar
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      onApplyFilters={() => setApplyTrigger(true)}
    />

    {/* Right Side (Scrollable) */}
    <div className="flex-1 h-[calc(100vh-100px)] overflow-y-auto"> 
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold satosi_bold">Products</h2>
        <span className="text-sm text-gray-500 satosi_light">
          Showing {products.length} Products
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <EmptyProducts />
          </div>
        ) : (
          products.map((item, i) => (
            <ProductCard key={i} item={item} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  page: index + 1,
                }))
              }
              className={`px-3 py-1 rounded ${
                selectedFilters.page === index + 1
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
</section>

  );
};

export default ProductList;
