import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const EditBanner = () => {
  const { patch } = useApi();
  const navigate = useNavigate();
  const { state } = useLocation();
  const banner = state?.banner;

  const [preview, setPreview] = useState(banner?.bannerImage || null);

  const initialValues = {
    title: banner?.title || "",
    status: banner?.status || false,
    bannerImage: null,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    status: Yup.boolean().required("Status is required"),
    bannerImage: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("status", values.status);
      if (values.bannerImage) {
        formData.append("bannerImage", values.bannerImage);
      }

      const response = await patch(`${endpoints.updateBanner}/${banner.id}`, formData);

      toast.success(response.message || "Banner updated successfully");
      resetForm();
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <FaArrowLeft size={14} /> Back
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6">Update Banner</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
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

            {/* Status */}
            <div>
              <label className="block mb-1">Status</label>
              <Field as="select" name="status" className="w-full border px-3 py-2 rounded">
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block mb-1">Banner Image</label>
              <input
                name="bannerImage"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("bannerImage", file);
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="bannerImage"
                component="div"
                className="text-red-500 text-sm"
              />
              {/* Image Preview */}
              {preview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={preview}
                    alt="Banner Preview"
                    className="h-32 w-full object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="mt-4 button text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Update Banner
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditBanner;
