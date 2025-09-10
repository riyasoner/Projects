import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

const EditCashbackRules = () => {
    const { post, get, patch } = useApi();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);


    const initialValues = {
        name: "",
        description: "",
        cashbackType: "percentage",
        cashbackValue: "",
        minPurchaseAmount: "",
        applicableCategories: [],
        applicableProducts: [],
        paymentMethods: ["online", "wallet"],
        startDate: "",
        endDate: "",
        isActive: true,
    };
    const [cashbackData, setCashbackData] = useState(initialValues);
    const { state } = useLocation();
    const id = state?.id;

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchCashbackByid();
    }, []);



    const fetchCashbackByid = async () => {
        try {
            const api = await get(`${endpoints.getCashbackRuleById}/${id}`);
            const response = api.cashbackRule
            console.log(response)

            if (response) {
                setCashbackData({
                    name: response.name || "",
                    description: response.description || "",
                    cashbackType: response.cashbackType || "percentage",
                    cashbackValue: response.cashbackValue || "",
                    minPurchaseAmount: response.minPurchaseAmount || "",
                    applicableCategories: response.applicableCategories || [],
                    applicableProducts: response.applicableProducts || [],
                    paymentMethods: response.paymentMethods || [],
                    startDate: response.startDate ? response.startDate.split("T")[0] : "",
                    endDate: response.endDate ? response.endDate.split("T")[0] : "",
                    isActive: response.isActive ?? true,
                    expiryDays:response.expiryDays || 0
                });
            }
        } catch (error) {
            console.log("Error for Fetching Cashback ", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await get(endpoints.getAllCategories);
            setCategories(response.data || []);
        } catch (error) {
            console.log("Error for Fetching Categories", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await get(endpoints.getAllProducts);
            setProducts(response.data || []);
        } catch (error) {
            console.log("Error for Fetching Products", error);
        }
    };



    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        cashbackType: Yup.string().oneOf(["percentage", "fixed"]).required(),
        cashbackValue: Yup.number().required("Cashback value is required"),
        minPurchaseAmount: Yup.number().required("Min purchase amount is required"),
        applicableCategories: Yup.array()
            .min(1, "Select at least one category")
            .required(),
        applicableProducts: Yup.array()
            .min(1, "Select at least one product")
            .required(),

        paymentMethods: Yup.array()
            .min(1, "Select at least one Payment Method")
            .required(),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().required("End date is required"),
        isActive: Yup.boolean().required(),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                ...values,
                sellerId: parseInt(userId),
            };
            const response = await patch(`${endpoints.updateCashbackRule}/${id}`, payload);
            toast.success(response.message || "Cashback rule Updated");
            resetForm();
            navigate(-1);
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };
      const calculateExpiryDays = (start, end) => {
        if (!start || !end) return "";
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate - startDate;
        return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
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
            <h2 className="text-2xl font-bold mb-6">Edit Cashback Rule</h2>

            <Formik
                enableReinitialize
                initialValues={cashbackData}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="grid grid-cols-2 gap-4">
                        {/* Basic Fields */}
                        {[
                            { name: "name", label: "Rule Name" },
                            { name: "description", label: "Description" },
                            { name: "cashbackValue", label: "Cashback Value" },
                            { name: "minPurchaseAmount", label: "Min Purchase Amount" },
                            //   { name: "paymentMethods", label: "Payment Methods" },
                            // { name: "startDate", label: "Start Date", type: "date" },
                            // { name: "endDate", label: "End Date", type: "date" },
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
                           
                           <div>
                                                       <label className="block mb-1">Start Date</label>
                                                       <Field
                                                           name="startDate"
                                                           type="date"
                                                           className="w-full border px-3 py-2 rounded"
                                                           onChange={(e) => {
                                                               setFieldValue("startDate", e.target.value);
                                                               const days = calculateExpiryDays(e.target.value, values.endDate);
                                                               setFieldValue("expiryDays", days);
                                                           }}
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block mb-1">End Date</label>
                                                       <Field
                                                           name="endDate"
                                                           type="date"
                                                           className="w-full border px-3 py-2 rounded"
                                                           onChange={(e) => {
                                                               setFieldValue("endDate", e.target.value);
                                                               const days = calculateExpiryDays(values.startDate, e.target.value);
                                                               setFieldValue("expiryDays", days);
                                                           }}
                                                       />
                                                   </div>
                           
                                                   <div>
                                                       <label className="block mb-1">Expiry Days</label>
                                                       <Field
                                                           name="expiryDays"
                                                           type="number"
                                                           disabled
                                                           className="w-full border px-3 py-2 rounded bg-gray-100"
                                                       />
                                                   </div>
                        

                        {/* Cashback Type */}
                        <div>
                            <label className="block mb-1">Cashback Type</label>
                            <Field
                                as="select"
                                name="cashbackType"
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </Field>
                        </div>
                        {/* Add Payment Method */}
                        <div>
                            <label className="block mb-1">Payment Methods</label>
                            <select
                                onChange={(e) => {
                                    const selectedMethod = e.target.value;
                                    if (
                                        selectedMethod &&
                                        !values.paymentMethods.includes(selectedMethod)
                                    ) {
                                        setFieldValue("paymentMethods", [
                                            ...values.paymentMethods,
                                            selectedMethod,
                                        ]);
                                    }
                                }}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select payment method</option>
                                <option value="online">Online</option>
                                <option value="wallet">Wallet</option>
                                <option value="cod">Cash on Delivery</option>
                            </select>

                            {/* Show Selected Payment Methods */}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {values.paymentMethods.map((method) => (
                                    <span
                                        key={method}
                                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center gap-1"
                                    >
                                        {method}
                                        <FaTimes
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setFieldValue(
                                                    "paymentMethods",
                                                    values.paymentMethods.filter((m) => m !== method)
                                                )
                                            }
                                        />
                                    </span>
                                ))}
                            </div>

                            <ErrorMessage
                                name="paymentMethods"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>


                        {/* Add Categories One by One */}
                        <div>
                            <label className="block mb-1">Add Category</label>
                            <select
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    if (
                                        selectedId &&
                                        !values.applicableCategories.includes(selectedId)
                                    ) {
                                        setFieldValue("applicableCategories", [
                                            ...values.applicableCategories,
                                            selectedId,
                                        ]);
                                    }
                                }}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {values.applicableCategories.map((id) => {
                                    console.log(id)
                                    const category = categories.find((c) => c.id == id);
                                    console.log(category)
                                    return (
                                        <span
                                            key={id}
                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            {category?.name || ""}
                                            <FaTimes
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setFieldValue(
                                                        "applicableCategories",
                                                        values.applicableCategories.filter((cid) => cid !== id)
                                                    )
                                                }
                                            />
                                        </span>
                                    );
                                })}
                            </div>
                            <ErrorMessage
                                name="applicableCategories"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        {/* Add Products One by One */}
                        <div>
                            <label className="block mb-1">Add Product</label>
                            <select
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    if (
                                        selectedId &&
                                        !values.applicableProducts.includes(selectedId)
                                    ) {
                                        setFieldValue("applicableProducts", [
                                            ...values.applicableProducts,
                                            selectedId,
                                        ]);
                                    }
                                }}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select product</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.title}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {values.applicableProducts.map((id) => {
                                    const product = products.find((p) => p.id == id);
                                    return (
                                        <span
                                            key={id}
                                            className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            {product?.title}
                                            <FaTimes
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setFieldValue(
                                                        "applicableProducts",
                                                        values.applicableProducts.filter((pid) => pid !== id)
                                                    )
                                                }
                                            />
                                        </span>
                                    );
                                })}
                            </div>
                            <ErrorMessage
                                name="applicableProducts"
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
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </Field>
                        </div>

                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="mt-4 button text-white px-6 py-2 rounded"
                            >
                                Submit Cashback Rule
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditCashbackRules;
