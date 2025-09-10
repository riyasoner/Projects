import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CreateTicket = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await get(endpoints.getAllUsers);
  //     setUsers(response.data || []);
  //   } catch (error) {
  //     console.log("Error in fetching Users", error);
  //   }
  // };

  const initialValues = {
    userId: localStorage.getItem("userId"),
    subject: "",
    message: "",
    priority: "",
  };

  const validationSchema = Yup.object().shape({
    // userId: Yup.string().required("User is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
    priority: Yup.string()
      .oneOf(["low", "medium", "high"], "Invalid priority")
      .required("Priority is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await post(endpoints.createTicket, values);
      toast.success(response.message || "Ticket created successfully");
      resetForm();
      
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex justify-end mb-4">
        {/* <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition-colors"
        >
          <FaArrowLeft size={14} />
          Back
        </button> */}
      </div>
      <h2 className="text-2xl font-bold mb-6">Customer Support</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="grid grid-cols-2 gap-4">
          {/* User Select */}
          

          {/* Subject */}
          <div className="col-span-2">
            <label className="block mb-1">Subject</label>
            <Field
              name="subject"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter subject"
            />
            <ErrorMessage
              name="subject"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Message */}
          <div className="col-span-2">
            <label className="block mb-1">Message</label>
            <Field
              as="textarea"
              name="message"
              className="w-full border px-3 py-2 rounded"
              rows="4"
              placeholder="Enter your message"
            />
            <ErrorMessage
              name="message"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Priority */}
          <div className="col-span-2">
            <label className="block mb-1">Priority</label>
            <Field
              as="select"
              name="priority"
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Field>
            <ErrorMessage
              name="priority"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="mt-4 button text-white px-6 py-2 rounded"
            >
              Submit 
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateTicket;
