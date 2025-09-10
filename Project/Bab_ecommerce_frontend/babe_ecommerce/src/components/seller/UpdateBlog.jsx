import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import endpoints from "../../api/endpoints";
import useApi from "../../hooks/useApi";


const UpdateBlog = () => {
  const { post, get,patch } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [blog,setBlog]=useState(null)

  const {state}=useLocation();
  const id=state?.id

const fetchBlog = async () => {
  try {
    const res = await get(`${endpoints.getBlogById}/${id}`);
    const data = res.data || null;
    setBlog(data);

    // if blog already has images, set them in preview
    if (data?.images?.length) {
      setImagePreviews(data.images); // URLs from API
    }
  } catch (error) {
    console.log("Error for Fetching Blog", error);
  }
};
  const fetchCategory = async () => {
    try {
      const res = await get(endpoints.getAllMainCategories);
      setCategory(res.data || []);
    } catch (error) {
      console.log("Error for Fetching Category", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await get(endpoints.getAllProducts);
      setProduct(res.data || []);
    } catch (error) {
      console.log("Error for Fetching Products", error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProducts();
    fetchBlog();
  }, []);

  const initialValues = {
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    blogImages: [],
    categoryId: "",
    createdBy: userId || "",
    productId: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: "draft",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string().required("Description is required"),
    excerpt: Yup.string().required("Excerpt is required"),
    categoryId: Yup.string().required("Category is required"),
    metaTitle: Yup.string().required("Meta Title is required"),
    metaDescription: Yup.string().required("Meta Description is required"),
    metaKeywords: Yup.string().required("Meta Keywords are required"),
    status: Yup.string().required("Status is required"),
  });

  // handle image upload
  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);

    setFieldValue("blogImages", [...selectedFiles, ...files]);
  };

  // remove image
  const handleRemoveImage = (index, setFieldValue, values) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);

    setFieldValue("blogImages", updatedFiles);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      // normal fields append karna
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      formData.append("excerpt", values.excerpt);
      formData.append("categoryId", values.categoryId);
      formData.append("createdBy", values.createdBy);
      formData.append("productId", values.productId);
      formData.append("metaTitle", values.metaTitle);
      formData.append("metaDescription", values.metaDescription);
      formData.append("metaKeywords", values.metaKeywords);
      formData.append("status", values.status);

      // multiple blogImages append karna
      selectedFiles.forEach((file) => {
        formData.append("blogImages", file); // backend ko array me milega
      });

      const response = await patch(`${endpoints.updateBlog}/${id}`, formData);

      toast.success(response.message || "Blog created");
      resetForm();
      setImagePreviews([]);
      setSelectedFiles([]);
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <FaArrowLeft size={14} /> Back
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6">Update Blog</h2>

     <Formik
  initialValues={{
    title: blog?.title || "",
    slug: blog?.slug || "",
    description: blog?.description || "",
    excerpt: blog?.excerpt || "",
    blogImages: [],
    categoryId: blog?.categoryId?.toString() || "",
    createdBy: userId || "",
    productId: blog?.productId?.toString() || "",
    metaTitle: blog?.metaTitle || "",
    metaDescription: blog?.metaDescription || "",
    metaKeywords: blog?.metaKeywords || "",
    status: blog?.status || "draft",
  }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  enableReinitialize
>
        {({ setFieldValue, values }) => (
          <Form className="grid grid-cols-1 gap-4">
            {/* Title */}
            <div>
              <label className="block mb-1">Title</label>
              <Field
                name="title"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block mb-1">Slug</label>
              <Field
                name="slug"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="slug"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1">Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block mb-1">Excerpt</label>
              <Field
                name="excerpt"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="excerpt"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block mb-1">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, setFieldValue)}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex flex-wrap gap-3 mt-3">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(index, setFieldValue, values)
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1">Category</label>
              <Field
                as="select"
                name="categoryId"
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Category</option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Product */}
            <div>
              <label className="block mb-1">Product</label>
              <Field
                as="select"
                name="productId"
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Product</option>
                {product.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="productId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Meta Title */}
            <div>
              <label className="block mb-1">Meta Title</label>
              <Field
                name="metaTitle"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="metaTitle"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block mb-1">Meta Description</label>
              <Field
                as="textarea"
                name="metaDescription"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="metaDescription"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block mb-1">Meta Keywords</label>
              <Field
                name="metaKeywords"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="metaKeywords"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Status */}
            {/* <div>
              <label className="block mb-1">Status</label>
              <Field
                as="select"
                name="status"
                className="w-full border px-3 py-2 rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm"
              />
            </div> */}

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="mt-4 button text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                Submit Blog
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateBlog;
