import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CreatingRating = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const initialValues = {
    rating: "",
    review: "",
    userId: Number(userId),
  };

  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating can't be more than 5")
      .required("Rating is required"),
    review: Yup.string().required("Review is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await post(endpoints.createRating, values);
      toast.success(response.message || "Rating created");
      resetForm();
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
        >
          <FaArrowLeft size={14} />
          Back
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6">Give Your Rating</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div>
            <label className="block mb-1">Rating (1 to 5)</label>
            <Field
              type="number"
              name="rating"
              className="w-full border px-3 py-2 rounded"
              min="1"
              max="5"
            />
            <ErrorMessage
              name="rating"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block mb-1">Review</label>
            <Field
              as="textarea"
              name="review"
              className="w-full border px-3 py-2 rounded"
              rows={4}
            />
            <ErrorMessage
              name="review"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit Rating
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatingRating;
