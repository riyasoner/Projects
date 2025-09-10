const dayjs = require("dayjs");
const db = require("../../../config/config"); // Adjust the path to your config file
const { Op } = require("sequelize");
const Note = db.note;

// Create a new note
const createNote = async (req, res) => {
  try {
    const {
      description,
      type_of_notes,
      is_postponde,
      postponded_date,
      completed,
      bookId,
      userId
    } = req.body;

    // Validate required inputs
    if (!type_of_notes) {
      return res.status(200).json({
        status: false,
        message: "type_of_notes is required",
        data: [],
      });
    }

    // Parse and format the transaction_date
    const formattedDate = postponded_date
      ? dayjs(postponded_date, 'MM-DD-YYYY').format('YYYY-MM-DD') // Parse without timezone
      : null;

    // Check if the date is valid
    if (postponded_date && !dayjs(postponded_date, 'MM-DD-YYYY', true).isValid()) {
      return res.status(400).json({
        status: false,
        message: "Invalid postponded_date. Ensure the date is in MM-DD-YYYY format.",
        data: []
      });
    }

    const newNote = await Note.create({
      description,
      type_of_notes,
      bookId,
      userId,
      is_postponde: is_postponde || false,
      postponded_date: formattedDate,
      completed: completed || false,
    });

    return res.status(200).json({
      status: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    console.error("Error in createNote API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all notes
const getAllNotes = async (req, res) => {
  try {

    const {
      is_postponde,
      type_of_notes,
      completed,
      deleted,
      bookId,
      userId
    } = req.query
    const whereCondition = {deleted:false};


    if (is_postponde !== undefined) {
      whereCondition.is_postponde = { [Op.eq]: is_postponde === 'true'};
    }
    if (type_of_notes) {
      whereCondition.type_of_notes = { [Op.eq]: type_of_notes };
    }
    if (completed !== undefined) {
      whereCondition.completed = { [Op.eq]: completed === 'true'};
    }
    if (deleted !== undefined) {
      whereCondition.deleted = { [Op.eq]: deleted === 'true'};
    }
    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }
    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    const notes = await Note.findAll({
      where: whereCondition,
      order: [['id', 'DESC']],
    });

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No notes found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Notes retrieved successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Error in getAllNotes API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get a note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ where: { id } });

    if (!note) {
      return res.status(404).json({
        status: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Note retrieved successfully",
      data: note,
    });
  } catch (error) {
    console.error("Error in getNoteById API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Update a note by ID
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, type_of_notes, is_postponde, postponded_date, completed,deleted } = req.body;

    const [updated] = await Note.update(
      { description, type_of_notes, is_postponde, postponded_date, completed,deleted },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({
        status: false,
        message: "Note not found or no changes made",
      });
    }

    const updatedNote = await Note.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    console.error("Error in updateNote API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete (mark as deleted)
    const [updated] = await Note.update({ deleted: true }, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({
        status: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Note marked as deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteNote API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllWaitedTask = async (req, res) => {
  try {
    const {bookId,userId} = req.query;
    const whereCondition = {
      type_of_notes: "task",
      completed:false
    };

    
    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }
    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }
    
    const notes = await Note.findAll({
      where: whereCondition,
      order: [['id', 'DESC']],
    });

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No waited task are found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "waited Task retrieved successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Error in getAllNotes API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getAllWaitedTask
};
