import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import { Modal, Button, Form } from "react-bootstrap";

function EditCollectionModal({ show, handleClose, collection, refresh }) {
  const { patch, get } = useApi();

  const [formData, setFormData] = useState({
    transaction_date: "",
    category: "",
    description: "",
    to_account: "",
    coll_total_amount: "",
    coll_emiDue_date: "",
    coll_emi_times: "",
    coll_kisht_type: "",
  });

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (collection) {
      setFormData({
        transaction_date: collection.transaction_date || "",
        category: collection.category || "",
        description: collection.description || "",
        to_account: collection.to_account || "",
        coll_total_amount: collection.coll_total_amount || "",
        coll_emiDue_date: collection.coll_emiDue_date || "",
        coll_emi_times: collection.coll_emi_times || "",
        coll_kisht_type: collection.coll_kisht_type || "",
      });
    }
  }, [collection]);

  const fetchCategories = async () => {
    try {
      const response = await get(endPoints.getCategories);
      setCategories(response?.data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    if (show) {
      fetchCategories();
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await patch(
        `${endPoints.update_collection}/${collection.id}`,
        formData
      );

      if (response.status) {
        alert("Collection updated successfully!");
        refresh();
        handleClose();
      } else {
        alert(response.message || "Something went wrong while updating.");
      }
    } catch (error) {
      console.error("Error updating collection:", error.message || error);
      alert("Something went wrong while updating collection.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Transaction Date</Form.Label>
            <Form.Control
              type="date"
              name="transaction_date"
              value={formData.transaction_date?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            {categories.length > 0 ? (
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category_name}>
                    {cat.category_name}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <p className="text-muted">No categories available</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control
              type="number"
              name="coll_total_amount"
              value={formData.coll_total_amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>EMI Due Date</Form.Label>
            <Form.Control
              type="date"
              name="coll_emiDue_date"
              value={formData.coll_emiDue_date?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>Repayment Type</Form.Label>
            <Form.Select
              name="coll_kisht_type"
              value={formData.coll_kisht_type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              {[
                "monthly",
                "2_monthly",
                "3_monthly",
                "6_monthly",
                "weekly",
                "2_weekly",
                "3_weekly",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total EMIs</Form.Label>
            <Form.Select
              name="coll_emi_times"
              value={formData.coll_emi_times}
              onChange={handleChange}
            >
              <option value="">Continuously</option>
              {[...Array(60)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? "Time" : "Times"}
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Update Collection
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCollectionModal;
