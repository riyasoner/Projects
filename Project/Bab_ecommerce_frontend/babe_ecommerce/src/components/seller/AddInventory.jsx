import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddInventory = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { state } = useLocation();
  const id = state?.id;
  const successMessage=state?.successMessage;

    useEffect(() => {
    if (successMessage) {
      toast.info(successMessage); // 👈 use toast or show message box
    }
  }, [successMessage]);

  const [products, setProducts] = useState([]);
  const [initialValues, setInitialValues] = useState({
    productId: "",
    variantId: "",
    sellerId: userId,
    quantity: "",
    location: "",
    restockDate: "",
  });

  useEffect(() => {
    fetchProducts();
    if (id) fetchInventoryById(id);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await get(`${endpoints.getAllProducts}?sellerId=${userId}`);
      setProducts(response.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const fetchInventoryById = async (invId) => {
    try {
      const response = await get(`${endpoints.getInventoryById}/${invId}`);
      const inv = response.data;

      setInitialValues({
        productId: inv.productId?.toString() || "",
        variantId: inv.variantId?.toString() || "",
        sellerId: userId,
        quantity: inv.quantity || "",
        location: inv.location || "",
        restockDate: inv.restockDate ? inv.restockDate.split("T")[0] : "",
      });
    } catch (error) {
      toast.error("Failed to fetch inventory details");
    }
  };

  const validationSchema = Yup.object().shape({
    productId: Yup.string().required("Product is required"),
    variantId: Yup.string(), // Optional
    quantity: Yup.number().required("Quantity is required").min(1, "Must be at least 1"),
    location: Yup.string().required("Location is required"),
    restockDate: Yup.date().required("Restock date is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
        sellerId: parseInt(userId),
      };

      if (id) payload.id = id;

      const response = await post(endpoints.addOrUpdateInventory, payload);
      toast.success(response.message || (id ? "Inventory updated" : "Inventory added"));
      resetForm();
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <FaArrowLeft size={14} />
          Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">{id ? "Edit" : "Add"} Inventory</h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          const selectedProduct = products.find(p => p.id === parseInt(values.productId));

          return (
            <Form className="grid grid-cols-2 gap-4">
              {/* Product Dropdown */}
              <div>
                <label className="block mb-1">Select Product</label>
                <Field
                  as="select"
                  name="productId"
                  className="w-full border px-3 py-2 rounded"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const product = products.find(p => p.id === parseInt(selectedId));
                    setFieldValue("productId", selectedId);
                    setFieldValue("variantId", ""); // reset variant
                  }}
                >
                  <option value="">-- Select Product --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="productId" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Variant Dropdown */}
              {selectedProduct?.variants?.length > 0 && (
                <div>
                  <label className="block mb-1">Select Variant</label>
                  <Field as="select" name="variantId" className="w-full border px-3 py-2 rounded">
                    <option value="">-- Select Variant --</option>
                    {selectedProduct.variants.map(variant => (
                      <option key={variant.id} value={variant.id}>
                        {`${variant.variantName} - ${variant.color} - ${variant.size}`}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="variantId" component="div" className="text-red-500 text-sm" />
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block mb-1">Quantity</label>
                <Field name="quantity" type="number" className="w-full border px-3 py-2 rounded" />
                <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Location */}
              <div>
                <label className="block mb-1">Location</label>
                <Field name="location" type="text" className="w-full border px-3 py-2 rounded" />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Restock Date */}
              <div>
                <label className="block mb-1">Restock Date</label>
                <Field name="restockDate" type="date" className="w-full border px-3 py-2 rounded" />
                <ErrorMessage name="restockDate" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="mt-4 button text-white px-6 py-2 rounded hover:bg-purple-700"
                >
                  {id ? "Update" : "Submit"} Inventory
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddInventory;
