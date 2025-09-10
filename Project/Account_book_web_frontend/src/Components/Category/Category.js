import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Category() {
  const { get, del, patch } = useApi();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    upper_category: "",
    category_name: "",
    monthly_limit: "",
  });
  const userId = localStorage.getItem("userId");
  const fetchCategories = async () => {
    try {
      const response = await get(`${endPoints.getCategories}?userId=${userId}`);
      if (response?.data) {
        setCategories(response.data);
      } else {
        console.warn("No categories found.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this category?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await del(`${endPoints.deleteCategory}/${categoryId}`);
              fetchCategories();
            } catch (error) {
              console.error("Error deleting category:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      await patch(
        `${endPoints.updateCategory}/${selectedCategory.id}`,
        selectedCategory
      );
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Categories</h4>
      <div className="d-flex justify-content-end mb-3">
        <Link to="/add-category">
          <button className="btn text-white" style={{ background: "#019ED3" }}>
            <i className="bi bi-plus-circle me-2"></i> Add New Category
          </button>
        </Link>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Upper Category</th>
            <th scope="col">Name</th>
            <th scope="col">Monthly Limit</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.upper_category}</td>
                <td>{category.category_name}</td>
                <td>{category.monthly_limit}</td>
                <td>
                  <i
                    className="bi bi-pencil-square text-warning me-3"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    title="Edit"
                    onClick={() => handleEditCategory(category)}
                  ></i>
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    title="Delete"
                    onClick={() => handleDeleteCategory(category.id)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpperCategory">
              <Form.Label>Upper Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Upper Category"
                value={selectedCategory.upper_category}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    upper_category: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category Name"
                value={selectedCategory.category_name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    category_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formMonthlyLimit">
              <Form.Label>Monthly Limit</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Monthly Limit"
                value={selectedCategory.monthly_limit}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    monthly_limit: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateCategory}>
            Update Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Category;
