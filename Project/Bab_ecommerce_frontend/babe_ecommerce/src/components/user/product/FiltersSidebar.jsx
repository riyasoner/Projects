import React, { useEffect, useState } from "react";
import { IoChevronDownSharp, IoChevronForward } from "react-icons/io5";
import { FiSliders } from "react-icons/fi";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endpoints";
import { IoClose } from "react-icons/io5";

const FiltersSidebar = ({ selectedFilters, setSelectedFilters, onApplyFilters }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const { get } = useApi();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await get(endpoints.getAllMainCategories);

      const transformedData = (response.data || []).map((main) => ({
        id: main.id,
        name: main.name,
        slug: main.slug,
        categories: (main.categories || []).map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          subCategories: (cat.subCategories || []).map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
          })),
        })),
      }));

      setCategories(transformedData);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };


  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleSize = (size) => {
    setSelectedFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleStyle = (style) => {
    setSelectedFilters((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const toggleColor = (color) => {
    setSelectedFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleMainCategory = (mainId) => {
    setSelectedFilters((prev) => ({
      ...prev,
      mainCategoryId: prev.mainCategoryId === mainId ? "" : mainId,
      categoryId: "",         // Reset category when main changes
      subCategoryId: "",      // Reset sub when main changes
      page: 1,
    }));
  };

  const toggleCategory = (catId) => {
    setSelectedFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === catId ? "" : catId,
      subCategoryId: "",      // Reset sub when category changes
      page: 1,
    }));
  };

  const toggleSubCategory = (subId) => {
    setSelectedFilters((prev) => ({
      ...prev,
      subCategoryId: prev.subCategoryId === subId ? "" : subId,
      page: 1,
    }));
  };


  const handlePriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    setSelectedFilters((prev) => ({
      ...prev,
      maxPrice: newMax,
    }));
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-1 text-gray-700 text-sm">
        {categories.map((mainCat, mainIndex) => (
          <div key={mainCat.id} className="mb-3">

            {/* MAIN CATEGORY */}
            <div
              onClick={() => {
                toggleMainCategory(mainCat.id);
                toggleDropdown(mainIndex); // optional dropdown toggle
              }}
              className={`cursor-pointer flex justify-between items-center px-1 py-1 rounded hover:bg-gray-100 transition-all
        ${selectedFilters.mainCategoryId === mainCat.id ? "text-black font-semibold bg-gray-100" : "text-gray-800"}
      `}
            >
              <span>{mainCat.name}</span>
              <span>
                {openIndex === mainIndex ? <IoChevronDownSharp /> : <IoChevronForward />}
              </span>
            </div>

            {/* CATEGORIES */}
            {openIndex === mainIndex && (
              <div className="ml-4 mt-2 space-y-2 border-l border-gray-300 pl-2">
                {mainCat.categories.map((cat) => (
                  <div key={cat.id} className="mb-2">

                    {/* CATEGORY */}
                    <div
                      onClick={() => toggleCategory(cat.id)}
                      className={`cursor-pointer flex justify-between text-sm py-1 rounded hover:bg-gray-100 transition-all
                ${selectedFilters.categoryId === cat.id ? "text-black font-semibold bg-gray-100" : "text-gray-700"}
              `}
                    >
                      ↳ {cat.name}
                    </div>

                    {/* SUBCATEGORIES */}
                    {cat.subCategories?.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
                        {cat.subCategories.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubCategory(sub.id)}
                            className={`cursor-pointer text-sm py-[2px] rounded hover:bg-gray-100 transition-all
                      ${selectedFilters.subCategoryId === sub.id ? "text-black font-semibold bg-gray-100" : "text-gray-600"}
                    `}
                          >
                            ↳↳ {sub.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}



      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-1">Price</h3>
        <div className="flex justify-between text-xs text-gray-500">
          <span>${selectedFilters.minPrice || 0}</span>
          <span>${selectedFilters.maxPrice || 200}</span>
        </div>
        <input
          type="range"
          min="50"
          max="2000"
          value={selectedFilters.maxPrice || 200}
          onChange={handlePriceChange}
          className="w-full accent-black"
        />
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-2">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {["green", "red", "yellow", "orange", "blue", "purple", "black", "white", "cyan"].map(
            (color, i) => (
              <div
                key={i}
                onClick={() => toggleColor(color)}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${selectedFilters.colors.includes(color)
                  ? "border-black scale-110"
                  : "border-gray-300"
                  }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            )
          )}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-2">Size</h3>
        <div className="flex flex-wrap gap-2">
          {["L", "M", "XL", "XXL"].map((size, i) => (
            <button
              key={i}
              onClick={() => toggleSize(size)}
              className={`text-sm px-3 py-1 rounded-full border ${selectedFilters.sizes.includes(size)
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="text-black p-2 rounded-full text-2xl hover:bg-gray-100"
          aria-label="Show Filters"
        >
          <FiSliders />
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
          <div className="bg-white p-6 w-11/12 max-w-md rounded-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-black text-xl  "
              >
                  <IoClose />
              </button>
            </div>
            <FiltersContent />
            <button
              onClick={() => {
                onApplyFilters();
                setShowMobileFilters(false);
              }}
              className="mt-4 w-full py-2 button text-white rounded-lg hover:bg-gray-900"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full lg:w-1/4 p-5 border rounded-xl bg-white">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <FiSliders className="text-2xl mt-2" />
        </div>
        <div className="mt-4">
          <FiltersContent />
          <button
            onClick={onApplyFilters}
            className="mt-6 w-full py-2 mt-4 button text-white rounded-lg hover:bg-gray-900"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FiltersSidebar;
