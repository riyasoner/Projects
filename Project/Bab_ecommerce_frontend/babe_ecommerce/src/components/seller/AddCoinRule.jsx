import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddCoinRule = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const initialValues = {
    actionType: "",
    coinsPerAction: "",
    perAmount: "",
    isActive: "",
    createdBy: userId || ""
  };

  const validationSchema = Yup.object().shape({
    actionType: Yup.string().required("Action type is required"),
    coinsPerAction: Yup.number()
      .required("Coins per action is required")
      .positive("Must be positive"),
    perAmount: Yup.number()
      .required("Per amount is required")
      .positive("Must be positive"),
    isActive: Yup.boolean().required("Status is required"),
    // createdBy: Yup.string().required("Created By is required")
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = { ...values };
      const response = await post(endpoints.createCoinRule, payload);
      toast.success(response.message || "Coin rule created");
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
      <h2 className="text-2xl font-bold mb-6">Add Coin Rule</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="grid grid-cols-1 gap-4">
            {/* Action Type */}
            <div>
              <label className="block mb-1">Action Type</label>
              <Field
                as="select"
                name="actionType"
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select action type</option>
                <option value="order_placed">Order Placed</option>
                <option value="referral">Referral</option>
                <option value="signup">Signup</option>
              </Field>
              <ErrorMessage
                name="actionType"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Coins Per Action */}
            <div>
              <label className="block mb-1">Coins Per Action</label>
              <Field
                name="coinsPerAction"
                type="number"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="coinsPerAction"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Per Amount */}
            <div>
              <label className="block mb-1">Per Amount</label>
              <Field
                name="perAmount"
                type="number"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="perAmount"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1">Status</label>
              <Field
                as="select"
                name="isActive"
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Field>
              <ErrorMessage
                name="isActive"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Created By */}
            {/* <div>
              <label className="block mb-1">Created By</label>
              <Field
                name="createdBy"
                type="text"
                className="w-full border px-3 py-2 rounded"
                readOnly
              />
              <ErrorMessage
                name="createdBy"
                component="div"
                className="text-red-500 text-sm"
              />
            </div> */}

            <div>
              <button
                type="submit"
                className="mt-4 button text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                Submit Coin Rule
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCoinRule;
