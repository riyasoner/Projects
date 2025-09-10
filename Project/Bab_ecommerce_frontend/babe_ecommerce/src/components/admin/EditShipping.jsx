import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const EditShipping = () => {
    const { patch, get } = useApi();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState("");
    const { state } = useLocation();
    const [shipping, setShipping] = useState([])
    const id = state?.id
    useEffect(() => {
        fetchShippingById()
    }, [])
    const fetchShippingById = async () => {
        try {
            const response = await get(`${endpoints.getShippingFeeById}/${id}`);
            const data = response.data || {};
            setShipping(data);
            setSelectedType(data.shippingType);

        } catch (error) {
            console.log("Error in fetching Shipping Data By id", error)
        }
    }

    /* ---------- initial form values ---------- */
    const initialValues = {
        shippingType: shipping?.shippingType,
        flatRate: shipping?.flatRate,
        freeAboveAmount: shipping?.freeAboveAmount,
        city: shipping?.city,
        locationFee: shipping?.locationFee,
        weightRatePerKg: shipping?.weightRatePerKg,
        isActive: shipping?.isActive ?? true,
    };

    /* ---------- yup validation schema ---------- */
    const validationSchema = Yup.object().shape({
        shippingType: Yup.string()
            .oneOf(
                ["flat_rate", "free_above", "location_based", "weight_based"],
                "Invalid shipping type"
            )
            .required("Shipping type is required"),

        flatRate: Yup.number().when("shippingType", {
            is: "flat_rate",
            then: () =>
                Yup.number()
                    .typeError("Flat rate must be a number")
                    .min(0, "Flat rate must be non‑negative")
                    .required("Flat rate is required"),
            otherwise: () => Yup.mixed().notRequired(),
        }),

        freeAboveAmount: Yup.number().when("shippingType", {
            is: "free_above",
            then: () =>
                Yup.number()
                    .typeError("Amount must be a number")
                    .min(0, "Amount must be non‑negative")
                    .required("Free above amount is required"),
            otherwise: () => Yup.mixed().notRequired(),
        }),

        city: Yup.string().when("shippingType", {
            is: "location_based",
            then: () => Yup.string().required("City is required"),
            otherwise: () => Yup.mixed().notRequired(),
        }),

        locationFee: Yup.number().when("shippingType", {
            is: "location_based",
            then: () =>
                Yup.number()
                    .typeError("Location fee must be a number")
                    .min(0, "Fee must be non‑negative")
                    .required("Location fee is required"),
            otherwise: () => Yup.mixed().notRequired(),
        }),

        weightRatePerKg: Yup.number().when("shippingType", {
            is: "weight_based",
            then: () =>
                Yup.number()
                    .typeError("Rate per kg must be a number")
                    .min(0, "Rate must be non‑negative")
                    .required("Rate per kg is required"),
            otherwise: () => Yup.mixed().notRequired(),
        }),

        isActive: Yup.boolean(),
    });

    /* ---------- submit handler ---------- */
    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = { shippingType: values.shippingType, isActive: values.isActive };

            switch (values.shippingType) {
                case "flat_rate":
                    payload.flatRate = Number(values.flatRate);
                    break;
                case "free_above":
                    payload.freeAboveAmount = Number(values.freeAboveAmount);
                    break;
                case "location_based":
                    payload.city = values.city;
                    payload.locationFee = Number(values.locationFee);
                    break;
                case "weight_based":
                    payload.weightRatePerKg = Number(values.weightRatePerKg);
                    break;
                default:
                    break;
            }

            const res = await patch(`${endpoints.updateShippingFee}/${id}`, payload);
            toast.success(res.message || "Shipping fee Updated successfully");
            resetForm();
            setSelectedType("");
            navigate(-1);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    /* ---------- component JSX ---------- */
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
            {/* back button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                    <FaArrowLeft size={14} />
                    Back
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">Update Shipping Rule</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ setFieldValue }) => (
                    <Form className="grid grid-cols-2 gap-4">
                        {/* shipping type */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block mb-1">Shipping Type</label>
                            <Field
                                as="select"
                                name="shippingType"
                                className="w-full border px-3 py-2 rounded"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedType(val);
                                    setFieldValue("shippingType", val);
                                }}
                            >
                                <option value="">Select Type</option>
                                <option value="flat_rate">Flat Rate</option>
                                <option value="free_above">Free Above</option>
                                <option value="location_based">Location Based</option>
                                <option value="weight_based">Weight Based</option>
                            </Field>
                            <ErrorMessage name="shippingType" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* conditional fields */}
                        {selectedType === "flat_rate" && (
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1">Flat Rate (₹)</label>
                                <Field name="flatRate" type="number" className="w-full border px-3 py-2 rounded" />
                                <ErrorMessage name="flatRate" component="div" className="text-red-500 text-sm" />
                            </div>
                        )}

                        {selectedType === "free_above" && (
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1">Free Above Amount (₹)</label>
                                <Field
                                    name="freeAboveAmount"
                                    type="number"
                                    className="w-full border px-3 py-2 rounded"
                                />
                                <ErrorMessage
                                    name="freeAboveAmount"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                        )}

                        {selectedType === "location_based" && (
                            <>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block mb-1">City</label>
                                    <Field name="city" type="text" className="w-full border px-3 py-2 rounded" />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block mb-1">Location Fee (₹)</label>
                                    <Field
                                        name="locationFee"
                                        type="number"
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                    <ErrorMessage
                                        name="locationFee"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                            </>
                        )}

                        {selectedType === "weight_based" && (
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1">Rate per Kg (₹)</label>
                                <Field
                                    name="weightRatePerKg"
                                    type="number"
                                    className="w-full border px-3 py-2 rounded"
                                />
                                <ErrorMessage
                                    name="weightRatePerKg"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                        )}

                        {/* active toggle */}
                        <div className="col-span-2 flex items-center gap-2">
                            <Field type="checkbox" name="isActive" id="isActive" className="h-4 w-4" />
                            <label htmlFor="isActive" className="select-none">
                                Active
                            </label>
                        </div>

                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="mt-4 button text-white px-6 py-2 rounded"
                            >
                                Update Shipping Rule
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditShipping;
