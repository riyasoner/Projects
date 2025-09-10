import React, { useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";

const EditProducts = () => {
    const { get, patch } = useApi();
    const { id } = useParams();
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [categories, setCategories] = useState([]);
    const [initialValues, setInitialValues] = useState(null); // ★ dynamic initial values
    const [isCustomization, setCustomization] = useState(false)

    /* ---------- Fetch master data ---------- */
    useEffect(() => {
        fetchCategories();
        fetchProductById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const fetchCategories = async () => {
        try {
            const res = await get(endpoints.getAllMainCategories);
            setCategories(res.data || []);
        } catch (err) {
            console.log(err.message || "Error fetching categories");
        }
    };

    const fetchProductById = async () => {
        try {
            const res = await get(`${endpoints.getProductById}/${id}`);
            const p = res.data;

            // ---- Safe parsing ----
            const paymentOptionsArr = (
                Array.isArray(p.paymentOptions)
                    ? p.paymentOptions
                    : (p.paymentOptions ? JSON.parse(p.paymentOptions) : [])
            ).map(opt => (opt === "wallet+online" ? "wallet" : opt));


            const customFieldsArr = Array.isArray(p.customFields)
                ? p.customFields
                : (p.customFields ? JSON.parse(p.customFields) : []);

            const featuresArr = Array.isArray(p.features)
                ? p.features
                : (p.features ? JSON.parse(p.features) : []);

            const keywordsArr = Array.isArray(p.keywords)
                ? p.keywords
                : (p.keywords ? JSON.parse(p.keywords) : []);


            // ✅ Variant Images as array-of-arrays
            const variantImagesArr = (p.variants || []).map(v =>
                Array.isArray(v.images) ? v.images : []
            );

            // ✅ Product Images
            const productImagesArr = Array.isArray(p.images) ? p.images : [];

            const specsObj = typeof p.specifications === "string"
                ? JSON.parse(p.specifications)
                : (p.specifications || {});

            const specsArr = Object.keys(specsObj).length
                ? Object.entries(specsObj).map(([key, value]) => ({ key, value }))
                : [{ key: "", value: "" }];

            const variantsArr = (p.variants || []).map(v => ({
                variantName: v.variantName || "",
                color: v.color || "",
                size: v.size || "",
                storage: v.storage || "",
                sku: v.sku || "",
                price: v.price || "",
                discountPercent: v.discountPercent || "",
                stock: v.stock || "",
            }));

            // ---- ✅ Correct initialValues (no setCustomization inside) ----
            const initial = {
                title: p.title || "",
                description: p.description || "",
                categoryId: p.categoryId || "",
                mainCategoryId: p.mainCategoryId || "",
                subCategoryId: p.subCategoryId || "",

                isCustomisable: !!p.isCustomisable,               // ✅ boolean
                customFields: customFieldsArr.length ? customFieldsArr : [""],
                keywords: keywordsArr.length ? keywordsArr : [""],
                paymentOptions: paymentOptionsArr.length ? paymentOptionsArr : [""],
                isCustomisableNote:p.isCustomisableNote ||"",

                brand: p.brand || "",
                price: p.price || "",
                discountPercent: p.discountPercent || "",
                sku: p.sku || "",
                stock: p.stock || "",
                features: featuresArr.length ? featuresArr : [""],
                specifications: specsArr,
                warranty: p.warranty || "",
                returnPolicy: p.returnPolicy || "",
                prepaidDiscountType: p.prepaidDiscountType || "",
                prepaidDiscountValue: p.prepaidDiscountValue || "",
                shippingInfo: p.shippingInfo || "",
                productImages: [],
                variantImages: [],
                variants: variantsArr.length
                    ? variantsArr
                    : [{ variantName: "", color: "", size: "", storage: "", sku: "", price: "", discountPercent: "", stock: "" }],
            };

            setInitialValues(initial);
            setCustomization(initial.isCustomisable);           // ✅ alag state me set
        } catch (err) {
            console.log(err.message || "Error fetching product");
        }
    };


    useEffect(() => {
        if (categories.length && initialValues?.mainCategoryId) {
            const mainCatId = parseInt(initialValues.mainCategoryId);
            const catId = parseInt(initialValues.categoryId);
            const subCatId = parseInt(initialValues.subCategoryId);

            const mainCat = categories.find(cat => cat.id === mainCatId);
            if (mainCat) {
                setSelectedCategories(mainCat.categories || []);

                const cat = mainCat.categories.find(c => c.id === catId);
                if (cat) {
                    setSelectedSubcategories(cat.subCategories || []);
                }
            }
        }
    }, [categories, initialValues]);


    /* ---------- Yup validation ---------- */
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.string().required("Category is required"),
        brand: Yup.string().required("Brand is required"),
        price: Yup.number().required("Price is required"),
        stock: Yup.number().required("Stock is required"),
        discountPercent: Yup.number().required("Discount is required"),
        sku: Yup.string().required("SKU is required"),
        features: Yup.array().of(Yup.string().required("Feature is required")),
        keywords: Yup.array().of(Yup.string().required("Keywords is required")),
        specifications: Yup.array().of(
            Yup.object({
                key: Yup.string().required("Key is required"),
                value: Yup.string().required("Value is required"),
            })
        ),

        variants: Yup.array().of(
            Yup.object({
                variantName: Yup.string().required("Variant name is required"),
                sku: Yup.string().required("SKU is required"),
                price: Yup.number().required("Price is required"),
                discountPercent: Yup.number().required("Discount is required"),
                stock: Yup.number().required("Stock is required"),
            })
        ),
        isCustomisable: Yup.boolean(),
        customFields: Yup.array().of(Yup.string().trim())
            .when("isCustomisable", {
                is: true,
                then: (schema) => schema.min(1, "Add at least one custom field"),
                otherwise: (schema) => schema.optional(),
            }),
    });

    /* ---------- Submit ---------- */
    const handleSubmit = async (values, { resetForm }) => {
        try {
            const fd = new FormData();

            // simple fields
            Object.keys(values).forEach((k) => {
                if (!["productImages", "variantImages", "variants", "features", "specifications", "customFields", "isCustomisable", "paymentOptions","keywords"].includes(k)) {
                    fd.append(k, values[k]);
                }
            });

            // images
            values.productImages.forEach((file) => {
                fd.append("productImages", file);
            });
            values.variantImages.forEach((imageGroup, index) => {
                if (Array.isArray(imageGroup)) {
                    imageGroup.forEach((file) => {
                        fd.append(`variantImages[${index}]`, file); // ✅ Correct
                    });
                }
            });


            // specs
            const specsObj = {};
            (values.specifications || []).forEach((s) => {
                if (s.key && s.value) specsObj[s.key] = s.value;
            });

            // ✅ Only if customisable; also trim empties
            const cleanedCustomFields = (values.customFields || [])
                .map((x) => (x ?? "").toString().trim())
                .filter(Boolean);

            fd.append("isCustomisable", values.isCustomisable ? "true" : "false");

            fd.append(
                "paymentOptions",
                JSON.stringify(
                    (values.paymentOptions || [])
                        .filter(f => (f ?? "").toString().trim()) // empty remove
                        .map(f => f === "wallet" ? "wallet+online" : f) // wallet → wallet+online
                )
            );

            fd.append("customFields", JSON.stringify(values.isCustomisable ? cleanedCustomFields : []));
            fd.append("features", JSON.stringify((values.features || []).filter(f => (f ?? "").toString().trim())));
            fd.append("keywords", JSON.stringify((values.keywords || []).filter(f => (f ?? "").toString().trim())));
            fd.append("specifications", JSON.stringify(specsObj));
            fd.append("variants", JSON.stringify(values.variants || []));
            fd.append("addedBy", userType);
            fd.append("sellerId", userId);
            
            // (optional) debug
            // console.log("Submitting customFields:", values.isCustomisable ? cleanedCustomFields : []);

            const res = await patch(`${endpoints.updateProductById}/${id}`, fd);
            toast.success(res.message || "Product updated successfully");

            resetForm();
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };


    /* ---------- UI ---------- */
    if (!initialValues) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-10">
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
            <h2 className="text-2xl font-bold mb-6">Update Product</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue }) => (
                    <Form encType="multipart/form-data">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                "title",
                                "description",
                                "brand",
                                "price",
                                "stock",
                                "discountPercent",
                                "sku",
                                "warranty",
                                "returnPolicy",
                                "shippingInfo",
                            ].map((field) => (
                                <div key={field}>
                                    <label className="block mb-1 capitalize">{field}</label>
                                    <Field
                                        name={field}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                    <ErrorMessage
                                        name={field}
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block mb-1" htmlFor="">Prepaid Discount Type</label>
                                <Field as="select" name="prepaidDiscountType" className="w-full border px-3 py-2 rounded">
                                    <option value="">Select</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                </Field>
                                {/* <ErrorMessage name="prepaidDiscountType" component="div" className="text-red-500 text-sm" /> */}
                            </div>
                            <div>
                                <label className="block mb-1" htmlFor="">Prepaid Discount Value</label>

                                <Field
                                    type="number"
                                    name="prepaidDiscountValue"
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {/* <ErrorMessage name="prepaidDiscountValue" component="div" className="text-red-500 text-sm" /> */}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block mb-1">Main Category</label>
                                <select
                                    className="w-full border px-3 py-2 rounded"
                                    value={values.mainCategoryId}
                                    onChange={(e) => {
                                        const selectedMainCatId = parseInt(e.target.value);
                                        const selectedCategory = categories.find(cat => cat.id === selectedMainCatId);

                                        setFieldValue("mainCategoryId", selectedMainCatId); // ✅

                                        if (selectedCategory?.categories?.length > 0) {
                                            setSelectedCategories(selectedCategory.categories);
                                            setSelectedSubcategories([]);
                                            setFieldValue("categoryId", "");        // clear sub level
                                            setFieldValue("subCategoryId", "");     // clear sub-sub level
                                        } else {
                                            setSelectedCategories([]);
                                            setSelectedSubcategories([]);
                                            setFieldValue("categoryId", "");
                                            setFieldValue("subCategoryId", "");
                                        }
                                    }}
                                >
                                    <option value="">Select  Category</option>
                                    {categories.map((mainCat) => (
                                        <option key={mainCat.id} value={mainCat.id}>
                                            {mainCat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCategories?.length > 0 && (
                                <div className="mt-0">
                                    <label className="block mb-1">Category</label>
                                    <select
                                        className="w-full border px-3 py-2 rounded"
                                        value={values.categoryId}
                                        onChange={(e) => {
                                            const selectedCatId = parseInt(e.target.value);
                                            const selectedSub = selectedCategories.find(cat => cat.id === selectedCatId);

                                            setFieldValue("categoryId", selectedCatId); // ✅

                                            if (selectedSub?.subCategories?.length > 0) {
                                                setSelectedSubcategories(selectedSub.subCategories);
                                                setFieldValue("subCategoryId", "");
                                            } else {
                                                setSelectedSubcategories([]);
                                                setFieldValue("subCategoryId", "");
                                            }
                                        }}
                                    >
                                        <option value="">Select Category</option>
                                        {selectedCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedSubcategories?.length > 0 && (
                                <div className="mt-0">
                                    <label className="block mb-1">Sub Category</label>
                                    <select
                                        className="w-full border px-3 py-2 rounded"
                                        value={values.subCategoryId}
                                        onChange={(e) => setFieldValue("subCategoryId", parseInt(e.target.value))}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {selectedSubcategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Product Images */}
                            <div className="mt-2">
                                <label className="block mb-1">Product Images</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const updated = [...values.productImages, file];
                                            setFieldValue("productImages", updated);
                                        }
                                        e.target.value = null;
                                    }}
                                    className="w-full"
                                />

                                {values.productImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {values.productImages.map((img, index) => (
                                            <div key={index} className="relative group border p-2 rounded shadow-sm">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`product-img-${index}`}
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-white text-red-500 text-sm rounded-full p-1 shadow hover:bg-red-100"
                                                    onClick={() => {
                                                        const updated = values.productImages.filter((_, i) => i !== index);
                                                        setFieldValue("productImages", updated);
                                                    }}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 flex items-center gap-2">
                                <Field
                                    type="checkbox"
                                    name="isCustomisable"
                                    checked={values.isCustomisable}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFieldValue("isCustomisable", checked);
                                        setCustomization(checked);
                                        // optional: clean up values jab off karo
                                        if (!checked) setFieldValue("customFields", []);
                                        if (checked && (!values.customFields || !values.customFields.length)) {
                                            setFieldValue("customFields", [""]);
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isCustomisable" className="text-gray-700">Is Customisable</label>
                            </div>



                            {isCustomization && (
                                <div className="col-span-2">
                                    <h3 className="font-semibold mb-2">Custom Fields</h3>
                                    <FieldArray name="customFields">
                                        {({ push, remove }) => (
                                            <div className="space-y-2">
                                                {(values.customFields || []).map((_, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Field
                                                            name={`customFields.${index}`}
                                                            className="flex-1 border px-3 py-2 rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="bg-red-500 text-white px-2 rounded"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => push("")}
                                                    className="text-blue-600"
                                                >
                                                    + Add Custom Fields
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            )}
                             <div className="">
                                              <label className="block mb-1" htmlFor="isCustomisableNote">Customisable Note</label>
                                              <Field
                                                name="isCustomisableNote"
                                                type="text"
                                                className="w-full border px-3 py-2 rounded"
                                                placeholder="Enter note"
                                              />
                                              {/* <ErrorMessage name="isCustomisableNote" component="div" className="text-red-500 text-sm" /> */}
                                            </div>

                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Payment Options</h3>
                                <div className="space-y-2 ">
                                    {["online", "wallet", "cod"].map((option, index) => (
                                        <label key={index} className="flex items-center gap-5">
                                            <Field
                                                type="checkbox"
                                                name="paymentOptions"
                                                value={option}
                                                className="w-4 h-4 "
                                                  disabled={option === "online" || option === "wallet"}
                                            />
                                            <span className="capitalize p-1">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* ------- Features ------- */}
                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Features</h3>
                                <FieldArray name="features">
                                    {({ push, remove }) => (
                                        <div className="space-y-2">
                                            {values.features.map((_, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <Field
                                                        name={`features.${i}`}
                                                        className="flex-1 border px-3 py-2 rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(i)}
                                                        className="bg-red-500 text-white px-2 rounded"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push("")}
                                                className="text-blue-600"
                                            >
                                                + Add Feature
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* ------- Specifications ------- */}
                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Specifications</h3>
                                <FieldArray name="specifications">
                                    {({ push, remove }) => (
                                        <div className="space-y-3">
                                            {values.specifications.map((_, i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <Field
                                                        name={`specifications.${i}.key`}
                                                        placeholder="Key"
                                                        className="flex-1 border px-3 py-2 rounded"
                                                    />
                                                    <Field
                                                        name={`specifications.${i}.value`}
                                                        placeholder="Value"
                                                        className="flex-1 border px-3 py-2 rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(i)}
                                                        className="bg-red-500 text-white p-2 rounded"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push({ key: "", value: "" })}
                                                className="text-blue-600"
                                            >
                                                + Add Specification
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                             <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Keywords</h3>
                                <FieldArray name="keywords">
                                    {({ push, remove }) => (
                                        <div className="space-y-2">
                                            {values.keywords.map((_, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <Field
                                                        name={`keywords.${i}`}
                                                        className="flex-1 border px-3 py-2 rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(i)}
                                                        className="bg-red-500 text-white px-2 rounded"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push("")}
                                                className="text-blue-600"
                                            >
                                                + Add  Keywords
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* ------- Variants ------- */}
                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Variants</h3>
                                <FieldArray name="variants">
                                    {({ push, remove }) => (
                                        <div className="space-y-4">
                                            {values.variants.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border p-4 rounded bg-gray-50 space-y-2"
                                                >
                                                    {[
                                                        "variantName",
                                                        "color",
                                                        "size",
                                                        "storage",
                                                        "sku",
                                                        "price",
                                                        "discountPercent",
                                                        "stock",
                                                    ].map((f) => (
                                                        <div key={f}>
                                                            <label className="block mb-1 capitalize">{f}</label>
                                                            <Field
                                                                name={`variants.${idx}.${f}`}
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <ErrorMessage
                                                                name={`variants.${idx}.${f}`}
                                                                component="div"
                                                                className="text-red-500 text-sm"
                                                            />
                                                        </div>
                                                    ))}

                                                    {/* Variant Images */}
                                                    <div className="mt-2">
                                                        <label className="block mb-1">Upload  Images</label>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => {
                                                                const files = Array.from(e.target.files);
                                                                if (files.length > 0) {
                                                                    const updated = [...values.variantImages];
                                                                    const existing = updated[idx] || [];
                                                                    updated[idx] = [...existing, ...files];
                                                                    setFieldValue("variantImages", updated);
                                                                }
                                                                e.target.value = null;
                                                            }}
                                                            className="w-full  border border-gray-300 p-2 rounded-[5px]"
                                                        />

                                                        {values.variantImages[idx]?.length > 0 && (
                                                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                                {values.variantImages[idx].map((img, i) => (
                                                                    <div key={i} className="relative group border p-2 rounded shadow-sm">
                                                                        <img
                                                                            src={URL.createObjectURL(img)}
                                                                            alt={`preview-${i}`}
                                                                            className="w-full h-32 object-cover rounded"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="absolute top-1 right-1 bg-white text-red-500 text-sm rounded-full p-1 shadow hover:bg-red-100"
                                                                            onClick={() => {
                                                                                const updated = values.variantImages[idx].filter((_, j) => j !== i);
                                                                                const allGroups = [...values.variantImages];
                                                                                allGroups[idx] = updated;
                                                                                setFieldValue("variantImages", allGroups);
                                                                            }}
                                                                        >
                                                                            <FaTrashAlt />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => remove(idx)}
                                                        className="text-red-600"
                                                    >
                                                        ❌ Remove Variant
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const base = values.variants[0] || {};
                                                    push({
                                                        variantName: "",
                                                        color: "",
                                                        size: "",
                                                        storage: "",
                                                        sku: "",
                                                        price: base.price || "",
                                                        discountPercent: base.discountPercent || "",
                                                        stock: base.stock || "",
                                                    });
                                                }}
                                                className="text-blue-600"
                                            >
                                                + Add Variant
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 button text-white px-6 py-2 rounded hover:bg-gray-900"
                        >
                            Update Product
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditProducts;
