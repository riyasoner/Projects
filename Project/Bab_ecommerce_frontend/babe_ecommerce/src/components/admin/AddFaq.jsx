import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddFaq = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const initialValues = {
    question: "",
    answer: "",
    productId: "",
    isActive: true,
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    answer: Yup.string().required("Answer is required"),
    productId: Yup.string().required("Product is required"),
    isActive: Yup.boolean(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
      };
      const response = await post(endpoints.createFAQ, payload);
      toast.success(response.message || "FAQ created successfully");
      resetForm();
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await get(endpoints.getAllProducts);
      setProducts(response.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
        >
          <FaArrowLeft size={14} />
          Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Create FAQ</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Question */}
          <div className="sm:col-span-2">
            <label className="block mb-1">Question</label>
            <Field
              name="question"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your question"
            />
            <ErrorMessage
              name="question"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Answer */}
          <div className="sm:col-span-2">
            <label className="block mb-1">Answer</label>
            <Field
              as="textarea"
              name="answer"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter the answer"
              rows={4}
            />
            <ErrorMessage
              name="answer"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block mb-1">Select Product</label>
            <Field
              as="select"
              name="productId"
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Select Product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="productId"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block mb-1">Status</label>
            <Field
              as="select"
              name="isActive"
              className="w-full border px-3 py-2 rounded"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </Field>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="mt-4 button text-white px-6 py-2 rounded"
            >
              Submit FAQ
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default AddFaq;
