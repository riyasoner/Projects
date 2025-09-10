import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";

const Notes = ({ data = [], fetchNotes }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { post, patch } = useApi();

  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleOpenAddModal = () => {
    setIsAdding(true);
    setSelectedNote({
      description: "",
      type_of_notes: "",
      completed: false,
      deleted: false,
      is_postponde: false,
      postponded_date: "",
    });
    setShowModal(true);
  };

  const handleEdit = (note) => {
    setIsAdding(false);
    setSelectedNote(note);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedNote(null);
  };

  const handleSave = async () => {
    if (!selectedNote.description || !selectedNote.type_of_notes) {
      showMessage("Description and Type of Notes are required!", "danger");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const bookId = localStorage.getItem("bookId");

      const noteData = { ...selectedNote, userId, bookId };

      if (isAdding) {
        await post(`${endPoints.addNote}`, noteData);
        showMessage("Note added successfully!", "success");
      } else {
        await patch(`${endPoints.updateNote}/${selectedNote.id}`, noteData);
        showMessage("Note updated successfully!", "success");
      }

      fetchNotes();
      handleClose();
    } catch (error) {
      console.error("Error saving note:", error);
      showMessage("Something went wrong!", "danger");
    }
  };

  return (
    <div className="container">
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <div
        className="d-flex justify-content-between align-items-center text-white p-2"
        style={{ background: "#419EB9" }}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-pencil-fill me-2"></i>
          <span>Notes</span>
        </div>
        <div>
          <Button variant="light" size="sm" onClick={handleOpenAddModal}>
            + Add Note
          </Button>
        </div>
      </div>

      <div className="mt-3">
        {data.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          data.map((note) => (
            <div
              key={note.id}
              className="d-flex align-items-start bg-light p-3 mb-2 border rounded"
            >
              <div
                className="me-3 text-warning"
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(note)}
              >
                <i className="bi bi-pencil-square"></i>
              </div>
              <div className="flex-grow-1">
                <p className="mb-1 fw-bold">{note.description}</p>
                <small className="text-muted">
                  <span className="text-primary">{note.type_of_notes}</span>{" "}
                  NOTE | {new Date(note.createdAt).toLocaleDateString()}{" "}
                  {new Date(note.createdAt).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedNote && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isAdding ? "Add Note" : "Edit Note"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedNote.description}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Type of Notes</Form.Label>
                <Form.Select
                  value={selectedNote.type_of_notes}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      type_of_notes: e.target.value,
                    })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="addNote">addNote</option>
                  <option value="order">order</option>
                  <option value="task">task</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Completed</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={selectedNote.completed}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      completed: e.target.checked,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Deleted</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={selectedNote.deleted}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      deleted: e.target.checked,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Postponed</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={selectedNote.is_postponde}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      is_postponde: e.target.checked,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Postponed Date</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    selectedNote.postponded_date
                      ? selectedNote.postponded_date.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      postponded_date: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isAdding ? "Add Note" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Notes;
