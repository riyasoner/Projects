import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CreateDiscount = () => {
    const { post, get } = useApi();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const initialValues = {
        code: "",
        discountType: "percent",
        discountValue: "",
        minOrderValue: "",
        maxDiscount: "",
        usageLimit: "",
        usagePerUser: "",
        startDate: "",
        appliedOnType: "",
        appliedOnId: "",
        endDate: "",
        status: "active",
    };
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [mainCategory, setMainCategory] = useState([])
    useEffect(() => {
        fetchProduct();
        fetchCategory();
        fetchMainCategory();
        fetchSubCategory();
    }, [])


    const fetchProduct = async () => {
        try {
            const response = await get(endpoints.getAllProducts);
            setProducts(response.data || "")

        } catch (error) {
            console.log("Error for fetching product", error)
        }
    }
    const fetchCategory = async () => {
        try {
            const response = await get(endpoints.getAllCategories);
            setCategory(response.data || "")

        } catch (error) {
            console.log("Error for fetching product", error)
        }
    }
    const fetchSubCategory = async () => {
        try {
            const response = await get(endpoints.getAllSubCategories);
            setSubCategory(response.data || "")

        } catch (error) {
            console.log("Error for fetching product", error)
        }
    }
    const fetchMainCategory = async () => {
        try {
            const response = await get(endpoints.getAllMainCategories);
            setMainCategory(response.data || "")

        } catch (error) {
            console.log("Error for fetching product", error)
        }
    }

    const validationSchema = Yup.object().shape({
        code: Yup.string().required("Code is required"),
        discountType: Yup.string().oneOf(["percent", "fixed"]).required(),
         appliedOnType: Yup.string().required("Applied type is required"),
        discountValue: Yup.number().required("Discount value is required"),
        appliedOnId: Yup.number().required("Applied Id  value is required"),
        minOrderValue: Yup.number().required("Min order value is required"),
        maxDiscount: Yup.number().required("Max discount is required"),
        usageLimit: Yup.number().required("Usage limit is required"),
        usagePerUser: Yup.number().required("Usage per user is required"),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().required("End date is required"),
        status: Yup.string().oneOf(["active", "inactive"]).required(),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                ...values,
                sellerId: parseInt(userId),
            };
            const response = await post(endpoints.createCoupon, payload);
            toast.success(response.message || "Discount created");
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                    <FaArrowLeft size={14} />
                    Back
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">Create Discount</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="grid grid-cols-2 gap-4">
                        {/* Existing fields */}
                        {[
                            { name: "code", label: "Coupon Code" },
                            { name: "discountValue", label: "Discount Value" },
                            { name: "minOrderValue", label: "Min Order Value" },
                            { name: "maxDiscount", label: "Max Discount" },
                            { name: "usageLimit", label: "Usage Limit" },
                            { name: "usagePerUser", label: "Usage Per User" },
                            { name: "startDate", label: "Start Date", type: "date" },
                            { name: "endDate", label: "End Date", type: "date" },
                        ].map(({ name, label, type }) => (
                            <div key={name}>
                                <label className="block mb-1">{label}</label>
                                <Field
                                    name={name}
                                    type={type || "text"}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                <ErrorMessage
                                    name={name}
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                        ))}

                        {/* Discount Type */}
                        <div>
                            <label className="block mb-1">Discount Type</label>
                            <Field
                                as="select"
                                name="discountType"
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="percent">Percent</option>
                                <option value="fixed">Fixed</option>
                            </Field>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-1">Status</label>
                            <Field
                                as="select"
                                name="status"
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Field>
                        </div>

                        {/* Applied on Type */}
                        <div>
                            <label className="block mb-1">Applied Type</label>
                            <Field
                                as="select"
                                name="appliedOnType"
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">-- Select Type --</option>
                                <option value="product">Product</option>
                                <option value="subCategory">Sub Category</option>
                                <option value="mainCategory">Main Category</option>
                                <option value="category">Category</option>
                                <option value="all">All</option>
                            </Field>
                        </div>

                        {/* Conditionally show AppliedOnId dropdown */}
                        {values.appliedOnType && values.appliedOnType !== "all" && (
                            <div>
                                <label className="block mb-1">
                                    {`Select ${values.appliedOnType}`}
                                </label>
                                <Field
                                    as="select"
                                    name="appliedOnId"
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">-- Select --</option>

                                    {values.appliedOnType === "product" &&
                                        products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.title}
                                            </option>
                                        ))}

                                    {values.appliedOnType === "category" &&
                                        category.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}

                                    {values.appliedOnType === "subCategory" &&
                                        subCategory.map((sc) => (
                                            <option key={sc.id} value={sc.id}>
                                                {sc.name}
                                            </option>
                                        ))}

                                    {values.appliedOnType === "mainCategory" &&
                                        mainCategory.map((mc) => (
                                            <option key={mc.id} value={mc.id}>
                                                {mc.name}
                                            </option>
                                        ))}
                                </Field>
                                <ErrorMessage
                                    name="appliedOnId"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="mt-4 button text-white px-6 py-2 rounded"
                            >
                                Submit Discount
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

        </div>
    );
};

export default CreateDiscount;
