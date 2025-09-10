import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddPlateformFee = () => {
    const { post } = useApi();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const initialValues = {
        feeType: "",
        amountType: "",
        amountValue: "",
        adminId: userId,
    };

    const validationSchema = Yup.object().shape({
        feeType: Yup.string().required("Fee type is required"),
        amountType: Yup.string()
            .oneOf(["percentage", "fixed"])
            .required("Amount type is required"),
        amountValue: Yup.number()
            .typeError("Amount value must be a number")
            .required("Amount value is required"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                ...values,
                adminId: parseInt(userId),
            };
            const response = await post(endpoints.createAdminFeeConfig, payload);
            toast.success(response.message || "Platform fee created successfully!");
            resetForm();
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                    <FaArrowLeft size={14} />
                    Back
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">Create Platform Fee</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className="grid grid-cols-2 gap-4">
                    {/* Fee Type */}
                    <div>
                        <label className="block mb-1">Fee Type</label>
                        <Field
                            name="feeType"
                            type="text"
                            className="w-full border px-3 py-2 rounded"
                            placeholder="e.g. Transaction Fee"
                        />
                        <ErrorMessage
                            name="feeType"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Amount Type */}
                    <div>
                        <label className="block mb-1">Amount Type</label>
                        <Field
                            as="select"
                            name="amountType"
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Select Type</option>
                            <option value="percentage">Percent</option>
                            <option value="fixed">Fixed</option>
                        </Field>
                        <ErrorMessage
                            name="amountType"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Amount Value */}
                    <div className="col-span-2">
                        <label className="block mb-1">Amount Value</label>
                        <Field
                            name="amountValue"
                            type="number"
                            className="w-full border px-3 py-2 rounded"
                            placeholder="e.g. 10 or 500"
                        />
                        <ErrorMessage
                            name="amountValue"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2">
                        <button
                            type="submit"
                            className="mt-4 button text-white px-6 py-2 rounded"
                        >
                            Submit Platform Fee
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default AddPlateformFee;
