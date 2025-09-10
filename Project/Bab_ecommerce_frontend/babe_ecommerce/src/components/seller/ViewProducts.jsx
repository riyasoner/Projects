// ViewProducts.jsx
// Updated: supports multiple‑image editing & removal, plus react‑icons integration.

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { FaEdit, FaTrashAlt, FaTimes, FaArrowLeft } from "react-icons/fa";

function ViewProducts() {
  const { id } = useParams();
  const { get, patch, del } = useApi();

  const [product, setProduct] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate=useNavigate()

  /* -------------------------------------------------------------------------- */
  /*                                  Fetching                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchProductById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductById = async () => {
    try {
      const res = await get(`${endpoints.getProductById}/${id}`);
      setProduct(res.data || {});
    } catch (err) {
      console.error("Error fetching product:", err.message);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Variant                                   */
  /* -------------------------------------------------------------------------- */

  const handleEdit = (variant) => {
    setEditingVariant({ ...variant }); // clone so we can mutate safely
    setShowEditModal(true);
  };

  const handleDelete = async (variantId) => {
    try {
      await del(`${endpoints.deleteVariant}/${variantId}`);
      toast.success("Variant deleted successfully");
      fetchProductById();
    } catch (error) {
      toast.error("Error deleting variant");
    }
  };

  const handleDeleteClick = (variantId) =>
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this variant?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete(variantId) },
        { label: "No" },
      ],
    });

  // Remove an existing image from the preview list (front‑end only)
  const handleRemoveExistingImage = (index) => {
    setEditingVariant((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVariantUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("variantName", values.variantName);
      formData.append("color", values.color);
      formData.append("size", values.size);
      formData.append("storage", values.storage);
      formData.append("sku", values.sku);
      formData.append("price", values.price);
      formData.append("discountPercent", values.discountPercent);
      formData.append("stock", values.stock);

      // Add existing images if any
      formData.append(
        "existingVariantImages",
        JSON.stringify(editingVariant.variantImages || [])
      );

      // Add newly selected images
      if (values.images && values.images.length > 0) {
        Array.from(values.images).forEach((file) => {
          formData.append("variantImages", file); // key must match backend's multer setup
        });
      }

      await patch(`${endpoints.updateVariant}/${editingVariant.id}`, formData

      );

      toast.success("Variant updated successfully");
      setShowEditModal(false);
      resetForm();
      fetchProductById();
    } catch (error) {
      toast.error("Error updating variant");
    } finally {
      setSubmitting(false);
    }
  };


  /* -------------------------------------------------------------------------- */
  /*                                    JSX                                     */
  /* -------------------------------------------------------------------------- */

  if (!product)
    return <div className="p-6 text-center">Loading…</div>;

 const parsedFeatures = product.features || [];
const parsedSpecifications = product.specifications || {};

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ── Title */}
      <div className="flex justify-end mb-4">
  <button
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2
               px-4 py-2 rounded
               bg-gray-200 text-gray-700
               hover:bg-gray-300 active:bg-gray-400
               transition-colors"
  >
    <FaArrowLeft size={14} />
    Back
  </button>
</div>

      <h2 className="text-3xl font-bold mb-6">{product.title}</h2>

      {/* ── Product Images */}
      <div className="flex flex-wrap gap-4 mb-8">
        {product.images?.map((img, idx) => (
          <img key={idx} src={img} alt={`product-${idx}`} className="w-44 h-44 object-cover rounded shadow" />
        ))}
      </div>

      {/* ── Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Basic Info</h3>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category?.name}</p>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Status:</strong> {product.status}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Discount:</strong> {product.discountPercent}%</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Other Details</h3>
          <p><strong>Warranty:</strong> {product.warranty}</p>
          <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
          <p><strong>Shipping Info:</strong> {product.shippingInfo}</p>
          <p><strong>Added By:</strong> {product.addedBy}</p>
          <p><strong>Slug:</strong> {product.slug}</p>
          <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* ── Description */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p>{product.description}</p>
      </div>

      {/* ── Features */}
      {parsedFeatures.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-8">
          <h3 className="text-xl font-semibold mb-2">Features</h3>
          <ul className="list-disc pl-6">
            {parsedFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Specifications */}
      {Object.keys(parsedSpecifications).length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-8">
          <h3 className="text-xl font-semibold mb-2">Specifications</h3>
          <ul className="list-disc pl-6">
            {Object.entries(parsedSpecifications).map(([k, v], idx) => (
              <li key={idx}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Variants */}
      {product.variants?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Variants</h3>
          {product.variants.map((variant, idx) => (
            <div key={idx} className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Variant Name:</strong> {variant.variantName}</p>
                  <p><strong>Color:</strong> {variant.color}</p>
                  <p><strong>Size:</strong> {variant.size}</p>
                  <p><strong>Storage:</strong> {variant.storage}</p>
                </div>
                <div>
                  <p><strong>SKU:</strong> {variant.sku}</p>
                  <p><strong>Price:</strong> ₹{variant.price}</p>
                  <p><strong>Discount:</strong> {variant.discountPercent}%</p>
                  <p><strong>Stock:</strong> {variant.stock}</p>
                </div>
              </div>

              {/* Variant images */}
              <div className="flex flex-wrap gap-3 mt-2">
                {variant.images?.map((img, i) => (
                  <img key={i} src={img} alt={`variant-${i}`} className="w-32 h-32 object-cover rounded shadow" />
                ))}
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(variant)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaEdit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(variant.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <FaTrashAlt size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Variant Modal */}
      {showEditModal && editingVariant && (
        <div
          className="fixed inset-0 overflow-auto bg-opacity-40 flex items-center justify-center z-50"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="bg-white p-6 rounded w-full max-w-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Edit Variant</h3>

            <Formik
              enableReinitialize
              initialValues={{
                variantName: editingVariant.variantName || "",
                color: editingVariant.color || "",
                size: editingVariant.size || "",
                storage: editingVariant.storage || "",
                sku: editingVariant.sku || "",
                price: editingVariant.price || "",
                discountPercent: editingVariant.discountPercent || "",
                stock: editingVariant.stock || "",
                images: [], // newly selected files
              }}
              onSubmit={handleVariantUpdate}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field name="variantName" placeholder="Variant Name" className="border p-2 rounded w-full" />
                    <Field name="color" placeholder="Color" className="border p-2 rounded w-full" />
                    <Field name="size" placeholder="Size" className="border p-2 rounded w-full" />
                    <Field name="storage" placeholder="Storage" className="border p-2 rounded w-full" />
                    <Field name="sku" placeholder="SKU" className="border p-2 rounded w-full" />
                    <Field name="price" placeholder="Price" type="number" className="border p-2 rounded w-full" />
                    <Field name="discountPercent" placeholder="Discount (%)" type="number" className="border p-2 rounded w-full" />
                    <Field name="stock" placeholder="Stock" type="number" className="border p-2 rounded w-full" />
                  </div>

                  {/* Image uploader */}
                  <div className="mt-4">
                    <label className="block font-semibold mb-1">Upload Images</label>
                    <input
                      type="file"
                      name="images"
                      multiple
                      onChange={(e) => setFieldValue("images", e.currentTarget.files)}
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  {/* Existing images preview */}
                  {editingVariant.images?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Existing Images:</p>
                      <div className="flex flex-wrap gap-3">
                        {editingVariant.images.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img src={url} alt={`existing-${idx}`} className="h-20 w-20 object-cover border rounded" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(idx)}
                              className="hidden group-hover:block absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      {isSubmitting ? "Updating…" : "Update"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProducts;
