import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const { post } = useApi();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate=useNavigate()

 

 
  const initialValues = {
   name:"",
   description:''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name  is required"),
    description: Yup.string().required("Description is required"),
   
  
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await post(endpoints.createDepartMent, values);

      const successMessage = response.message || "Department added successfully!";
      setMessage(successMessage);
      toast.success(successMessage);
      resetForm();

      setTimeout(()=>{
        navigate(-1)
      },1500)
    } catch (error) {
      const errorMessage = error.message || "Failed to add Department";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <div className="bg-white p-4 rounded-3">
        <h2 className="fw-bold mb-4">Add Department</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form>
              <div className="row">
                {[
                 
                  { name: "name", label: "Name" },
                  { name: "description", label: "Description" },
                 
                ].map(({ name, label, type = "text" }) => (
                  <div className="col-md-6 mb-3" key={name}>
                    <label>{label}</label>
                    <Field type={type} name={name} className="form-control" />
                    <ErrorMessage name={name} component="small" className="text-danger" />
                  </div>
                ))}

                

                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Submitting..." : "Add Department"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddDepartment;
