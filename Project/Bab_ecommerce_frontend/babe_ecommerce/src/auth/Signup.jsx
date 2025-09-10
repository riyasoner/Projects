import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import useApi from "../hooks/useApi";
import endpoints from "../api/endpoints";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const Signup = () => {
  const { post } = useApi();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNo: "",
      password: "",
      confirmPassword: "",
      userType: "user",
      profileImage: null,
      gender: "", // optional
    },

    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Full name is required")
        .matches(/^[a-zA-Z ]{3,100}$/, "Only alphabets & spaces allowed (3–100 chars)"),

      email: Yup.string()
        .required("Email is required")
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"),

      phoneNo: Yup.string()
        .required("Phone number is required")
        .matches(/^[6-9]\d{9}$/, "Phone number must be 10 digits starting with 6-9"),

      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
          "Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char"
        ),

      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),

      userType: Yup.string().required("User type is required"),
    }),

    onSubmit: async (values) => {
      try {
        // Double-check: confirmPassword must match password
        if (values.password !== values.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const formData = new FormData();

        for (let key in values) {
          if (key === "confirmPassword") continue; // Don't send this to backend

          if (key === "profileImage" && values[key]) {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }

        const response = await post(endpoints.registration, formData);
        toast.success(response.message || "Registration Successful");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        toast.error(error.message || "Please Try Again");
      }
    }

  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("profileImage", file);
  };

  return (
    <>

    <div
  className="flex min-h-screen items-center justify-center bg-cover bg-center"
  // style={{
  //   backgroundImage:
  //     'url("https://c4.wallpaperflare.com/wallpaper/654/555/787/geometry-cyberspace-digital-art-lines-wallpaper-preview.jpg")',
  // }}
>
  <div className="w-full max-w-xl px-8 py-6 bg-white bg-opacity-95 shadow-2xl rounded-2xl">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
      Create Your Account
    </h2>
    <p className="text-center text-sm text-gray-600 mb-6">
      Start your journey with us — shop smarter, faster, better!
    </p>

    <form
      onSubmit={formik.handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.fullName}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="John Doe"
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="you@example.com"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          name="phoneNo"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNo}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="1234567890"
        />
        {formik.touched.phoneNo && formik.errors.phoneNo && (
          <p className="text-red-500 text-sm">{formik.errors.phoneNo}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="••••••••"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="••••••••"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {formik.errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          name="gender"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.gender}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Profile Image */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">
          Profile Image
        </label>
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Submit Button */}
      <div className="col-span-1 md:col-span-2">
        <button
          type="submit"
          className="w-full button text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Sign Up
        </button>
      </div>
    </form>

    <p className="text-center text-sm text-gray-600 mt-4">
      Already have an account?{" "}
      <span
        onClick={() => navigate("/login")}
        className="text-black font-medium hover:underline cursor-pointer"
      >
        Login
      </span>
    </p>
  </div>
</div>


    </>
  );
};

export default Signup;
