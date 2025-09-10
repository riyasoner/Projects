import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddressForm = ({
    showNewAddress,
    setShowNewAddress,
    fetchAddresses,
    userId,
    saveAddress,
    editingAddress
    , setEditingAddress
}) => {



    const initialValues = editingAddress || {
        userId: userId,
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        type: "home",
        isDefault: true,
    };

    // console.log(editingAddress)

    const validationSchema = Yup.object({
        fullName: Yup.string().required("Full Name is required"),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
            .required("Phone Number is required"),
        addressLine1: Yup.string().required("Address Line 1 is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        postalCode: Yup.string()
            .matches(/^[0-9]{6}$/, "Postal Code must be 6 digits")
            .required("Postal Code is required"),
    });

    return (
        <>
            {showNewAddress && (
                <div className="mt-6">
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 relative">

                        <p className="text-xl font-semibold text-gray-800 mb-4">
                            {initialValues.id ? "Edit Address" : "Add New Address"}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewAddress(false)
                                setEditingAddress(null)
                            }

                            }
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <AiOutlineClose />
                        </button>

                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { resetForm }) => {
                                await saveAddress(values);
                                fetchAddresses();
                                resetForm();
                                setShowNewAddress(false);
                            }}
                        >
                            {() => (
                                <Form className="space-y-4">
                                    {/* Full Name + Phone */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Full Name
                                            </label>
                                            <Field
                                                name="fullName"
                                                placeholder="Enter your full name"
                                                className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                            />
                                            <ErrorMessage
                                                name="fullName"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Phone Number
                                            </label>
                                            <Field
                                                name="phoneNumber"
                                                placeholder="Enter phone number"
                                                className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                            />
                                            <ErrorMessage
                                                name="phoneNumber"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Line 1 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Address Line 1
                                        </label>
                                        <Field
                                            name="addressLine1"
                                            placeholder="Flat / House No., Street"
                                            className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        />
                                        <ErrorMessage
                                            name="addressLine1"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* Address Line 2 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Address Line 2
                                        </label>
                                        <Field
                                            name="addressLine2"
                                            placeholder="(Optional)"
                                            className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        />
                                    </div>

                                    {/* Landmark */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Landmark
                                        </label>
                                        <Field
                                            name="landmark"
                                            placeholder="Near (optional)"
                                            className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        />
                                    </div>

                                    {/* City + State */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                City
                                            </label>
                                            <Field
                                                name="city"
                                                placeholder="Enter city"
                                                className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                            />
                                            <ErrorMessage
                                                name="city"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                State
                                            </label>
                                            <Field
                                                name="state"
                                                placeholder="Enter state"
                                                className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                            />
                                            <ErrorMessage
                                                name="state"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Postal Code + Type */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Postal Code
                                            </label>
                                            <Field
                                                name="postalCode"
                                                placeholder="Enter postal code"
                                                className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                            />
                                            <ErrorMessage
                                                name="postalCode"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Address Type
                                            </label>
                                            <Field
                                                as="select"
                                                name="type"
                                                className="border rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                            >
                                                <option value="home">Home</option>
                                                <option value="work">Work</option>
                                                <option value="other">Other</option>
                                            </Field>

                                            
                                        </div>
                                        <div>
                                        <Field
                                                type="checkbox"
                                                name="isDefault"
                                                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                                                Set as Default
                                            </label>
                                            </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        type="submit"
                                        className="mt-4 w-full button text-white py-2.5 rounded-lg text-sm font-medium hover:bg-pink-700 transition shadow-md" style={{ borderRadius: "10px" }}
                                    >
                                        Save Address
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

        </>
    );
};
export default AddressForm;
