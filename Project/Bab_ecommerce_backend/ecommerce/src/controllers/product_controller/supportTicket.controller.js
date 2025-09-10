const db = require("../../../config/config");
const supportTicket = db.supportTicket;
const supportTicketReply = db.supportTicketReply;
const user = db.user;
//  Helper for responses
const sendResponse = (res, status, message, data = null, code = 200) => {
  return res.status(code).json({ status, message, data });
};

//  Create a new support ticket
exports.createTicket = async (req, res) => {
  try {
    const { userId, subject, message, priority } = req.body;

    if (!userId || !subject || !message) {
      return sendResponse(
        res,
        false,
        "userId, subject, and message are required.",
        null,
        400
      );
    }

    const ticket = await supportTicket.create({
      userId,
      subject,
      message,
      priority: priority || "medium",
    });

    return sendResponse(res, true, "Ticket created successfully.", ticket, 201);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return sendResponse(res, false, "Internal server error.", null, 500);
  }
};

// 📌 Get all tickets (admin)
exports.getAllTickets = async (req, res) => {
  try {
    // 👇 Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 👇 Filter params
    const { status, priority } = req.query;

    // 👇 Build dynamic where condition
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // 👇 Count total with filters
    const totalCount = await supportTicket.count({ where });

    // 👇 Fetch filtered paginated records
    const tickets = await supportTicket.findAll({
      where,
      include: [
        { model: supportTicketReply, as: "replies" },
        {
          model: user,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 👇 Return paginated filtered response
    return sendResponse(res, true, "Tickets fetched successfully.", {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      tickets,
    });
  } catch (error) {
    console.error("Get All Tickets Error:", error);
    return sendResponse(res, false, "Internal server error.", null, 500);
  }
};

// 📌 Get tickets by user ID
exports.getTicketsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return sendResponse(res, false, "userId is required.", null, 400);

    const tickets = await supportTicket.findAll({
      where: { userId },
      include: [{ model: supportTicketReply, as: "replies" }],
    });

    return sendResponse(
      res,
      true,
      "User tickets fetched successfully.",
      tickets
    );
  } catch (error) {
    console.error("Get User Tickets Error:", error);
    return sendResponse(res, false, "Internal server error.", null, 500);
  }
};

// 📌 Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return sendResponse(
        res,
        false,
        "Invalid status. Must be open, in_progress, resolved, or closed.",
        null,
        400
      );
    }

    const ticket = await supportTicket.findByPk(ticketId);
    if (!ticket)
      return sendResponse(res, false, "Ticket not found.", null, 404);

    ticket.status = status;
    await ticket.save();

    return sendResponse(res, true, "Ticket status updated.", ticket);
  } catch (error) {
    console.error("Update Ticket Status Error:", error);
    return sendResponse(res, false, "Internal server error.", null, 500);
  }
};

// 📌 Add reply to a ticket
exports.addReply = async (req, res) => {
  try {
    const { ticketId, senderType, senderId, message } = req.body;

    if (!ticketId || !senderType || !senderId || !message) {
      return sendResponse(
        res,
        false,
        "ticketId, senderType, senderId, and message are required.",
        null,
        400
      );
    }

    const validTypes = ["user", "admin"];
    if (!validTypes.includes(senderType)) {
      return sendResponse(
        res,
        false,
        'Invalid senderType. Must be "user" or "admin".',
        null,
        400
      );
    }

    const ticket = await supportTicket.findByPk(ticketId);
    if (!ticket)
      return sendResponse(res, false, "Ticket not found.", null, 404);

    const reply = await supportTicketReply.create({
      ticketId,
      senderType,
      senderId,
      message,
    });

    return sendResponse(res, true, "Reply added successfully.", reply, 201);
  } catch (error) {
    console.error("Add Reply Error:", error);
    return sendResponse(res, false, "Internal server error.", null, 500);
  }
};

exports.getSupportTicketSummary = async (req, res) => {
  try {
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
    ] = await Promise.all([
      supportTicket.count(),
      supportTicket.count({ where: { status: "open" } }),
      supportTicket.count({ where: { status: "in_progress" } }),
      supportTicket.count({ where: { status: "resolved" } }),
      supportTicket.count({ where: { status: "closed" } }),
    ]);

    return sendResponse(
      res,
      true,
      "Support ticket summary fetched successfully.",
      {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
      }
    );
  } catch (error) {
    console.error("Support Ticket Summary Error:", error);
    return sendResponse(res, false, "Internal server error.", null, 500);
  }
};
