import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddAnnouncement = () => {
  const { post } = useApi();
  const navigate = useNavigate();

  const initialValues = {
    message: "",
    status: true,
    link: "",
  };

  const validationSchema = Yup.object().shape({
    message: Yup.string().required("Message is required"),
    status: Yup.boolean().required("Status is required"),
    link: Yup.string().required("Enter a valid URL"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await post(endpoints.createAnnouncement, values);

      toast.success(response.message || "Announcement created successfully");
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
      <h2 className="text-2xl font-bold mb-6">Add Announcement</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="grid grid-cols-1 gap-4">
            {/* Message */}
            <div>
              <label className="block mb-1">Message</label>
              <Field
                name="message"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="message"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1">Status</label>
              <Field
                as="select"
                name="status"
                className="w-full border px-3 py-2 rounded"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block mb-1">Link</label>
              <Field
                name="link"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="link"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="mt-4 button text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Submit Announcement
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAnnouncement;
