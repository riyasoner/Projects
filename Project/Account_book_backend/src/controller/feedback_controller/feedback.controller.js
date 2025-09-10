const { Op } = require("sequelize");
const db = require("../../../config/config"); // Adjust the path to your config file
const Feedback = db.feedback;

// Create a new feedback
const createFeedback = async (req, res) => {
    try {
        const { description, userId } = req.body;

        const newFeedback = await Feedback.create({
             description:description,
             userId:userId
            });

        if (!newFeedback) {
            return res.status(400).json({
                status: false,
                message: "Feedback not created",
                data: []
            });
        }

        return res.status(201).json({
            status: true,
            message: "Feedback created successfully",
            data: newFeedback
        });
    } catch (error) {
        console.error("Error in createFeedback API:", error.message);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get all feedback
const getAllFeedbacks = async (req, res) => {
    try {
        const { userId} = req.query
        const whereCondition = {};

        if (userId) {
            whereCondition.userId = { [Op.eq]: userId };
        }
        const feedbacks = await Feedback.findAll({
            where: whereCondition,
            order: [['id', 'DESC']],
        });

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No feedback found",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Feedback retrieved successfully",
            data: feedbacks
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findOne({ where: { id } });

        if (!feedback) {
            return res.status(404).json({
                status: false,
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Feedback retrieved successfully",
            data: feedback
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Update feedback by ID
const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Feedback.update(req.body, { where: { id } });

        if (updated === 0) {
            return res.status(404).json({
                status: false,
                message: "Feedback not found or no changes made"
            });
        }

        const updatedFeedback = await Feedback.findOne({ where: { id } });

        return res.status(200).json({
            status: true,
            message: "Feedback updated successfully",
            data: updatedFeedback
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Feedback.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({
                status: false,
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};
