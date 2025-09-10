import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";
import Navbar from "./Navbar";
import Footer from "./Footer";

const BecomerSeller = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { post } = useApi();
    const userId = location.state?.userId || "";
    // console.log(first)

    const [step, setStep] = useState(1); // track tab/step

    const formik = useFormik({
        initialValues: {
            storeName: "",
            storeDescription: "",
            gstNumber: "",
            panNumber: "",
            businessType: "",
            bankAccountNumber: "",
            bankIFSC: "",
            pickupAddress: "",
            businessDocs: null,
            userId: userId,
        },
        validationSchema: Yup.object({
            storeName: Yup.string().required("Store name is required"),
            storeDescription: Yup.string().required("Store description is required"),
            // gstNumber: Yup.string().required("GST number is required"),
            panNumber: Yup.string().required("PAN number is required"),
            businessType: Yup.string().required("Business type is required"),
            bankAccountNumber: Yup.string().required("Bank account number is required"),
            bankIFSC: Yup.string().required("Bank IFSC code is required"),
            pickupAddress: Yup.string().required("Pickup address is required"),
            businessDocs: Yup.mixed().required("Business document is required"),
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                for (let key in values) {
                    formData.append(key, values[key]);
                }
                const response = await post(endpoints.createSellerProfile, formData);
                toast.success(response.message || "Seller Registered Successfully");
                setTimeout(() => navigate("/seller-login"), 1500);
            } catch (err) {
                toast.error(err.message || "Please try again");
            }
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formik.setFieldValue("businessDocs", file);
    };

    return (
        <>
        {/* <Navbar/> */}
        <div
  className="flex min-h-screen items-center justify-center bg-cover bg-center"
  // style={{
  //   backgroundImage:
  //     'url("https://c4.wallpaperflare.com/wallpaper/533/489/290/geometry-cyberspace-lines-digital-art-wallpaper-preview.jpg")',
  // }}
>
  <div className="w-full max-w-xl px-8 py-10 bg-white bg-opacity-95 shadow-2xl rounded-2xl">
    <h2 className="text-3xl font-bold text-center mb-2">Become a Seller</h2>
    <p className="text-sm text-center text-gray-600 mb-6">
      Register your store and start selling with us!
    </p>

    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {step === 1 && (
        <>
          {/* Step 1: Store Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.storeName}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your Store Name"
            />
            {formik.touched.storeName && formik.errors.storeName && (
              <p className="text-red-500 text-sm">{formik.errors.storeName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Description
            </label>
            <textarea
              name="storeDescription"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.storeDescription}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Describe your store"
            />
            {formik.touched.storeDescription &&
              formik.errors.storeDescription && (
                <p className="text-red-500 text-sm">
                  {formik.errors.storeDescription}
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gstNumber}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formik.touched.gstNumber && formik.errors.gstNumber && (
              <p className="text-red-500 text-sm">{formik.errors.gstNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.panNumber}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formik.touched.panNumber && formik.errors.panNumber && (
              <p className="text-red-500 text-sm">{formik.errors.panNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <select
              name="businessType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.businessType}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Type</option>
              <option value="Individual">Individual</option>
              <option value="Proprietorship">Proprietorship</option>
              <option value="Company">Company</option>
            </select>
            {formik.touched.businessType && formik.errors.businessType && (
              <p className="text-red-500 text-sm">
                {formik.errors.businessType}
              </p>
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            className="w-full button text-white py-2 rounded-lg mt-4 hover:bg-gray-900 transition"
            onClick={async () => {
              const errors = await formik.validateForm();
              const step1Fields = [
                "storeName",
                "storeDescription",
                "gstNumber",
                "panNumber",
                "businessType",
              ];

              const hasStep1Errors = step1Fields.some(
                (field) => errors[field]
              );

              if (hasStep1Errors) {
                step1Fields.forEach((field) =>
                  formik.setFieldTouched(field, true)
                );
                toast.error("Please fill all required fields");
              } else {
                setStep(2);
              }
            }}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* Step 2: Bank + Docs */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank Account Number
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bankAccountNumber}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formik.touched.bankAccountNumber &&
              formik.errors.bankAccountNumber && (
                <p className="text-red-500 text-sm">
                  {formik.errors.bankAccountNumber}
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank IFSC Code
            </label>
            <input
              type="text"
              name="bankIFSC"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bankIFSC}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formik.touched.bankIFSC && formik.errors.bankIFSC && (
              <p className="text-red-500 text-sm">{formik.errors.bankIFSC}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pickup Address
            </label>
            <input
              type="text"
              name="pickupAddress"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pickupAddress}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formik.touched.pickupAddress && formik.errors.pickupAddress && (
              <p className="text-red-500 text-sm">
                {formik.errors.pickupAddress}
              </p>
            )}
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700">
    Business Documents
  </label>
  <input
    type="file"
    name="businessDocs"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={handleFileChange}
    className="mt-1 w-full px-3 py-2 border rounded-lg"
  />
  {formik.touched.businessDocs && formik.errors.businessDocs && (
    <p className="text-red-500 text-sm">{formik.errors.businessDocs}</p>
  )}

  {/* File Preview */}
  {formik.values.businessDocs && (
    <div className="mt-3 p-3 border rounded-lg bg-gray-50">
      {formik.values.businessDocs.type.includes("image") ? (
        <img
          src={URL.createObjectURL(formik.values.businessDocs)}
          alt="Business Doc Preview"
          className="w-40 h-40 object-cover rounded-md shadow"
        />
      ) : formik.values.businessDocs.type === "application/pdf" ? (
        <div className="flex items-center gap-3">
          <span className="text-red-600 font-medium">📄 PDF File:</span>
          <a
            href={URL.createObjectURL(formik.values.businessDocs)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {formik.values.businessDocs.name}
          </a>
        </div>
      ) : (
        <p className="text-gray-600">File uploaded: {formik.values.businessDocs.name}</p>
      )}
    </div>
  )}
</div>


          {/* Back and Submit Buttons */}
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-gray-200 text-black py-2 rounded-lg"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-full button text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Register
            </button>
          </div>
        </>
      )}
    </form>
  </div>
</div>

        {/* <Footer/> */}
        </>
    );
};

export default BecomerSeller;
