const db = require("../../../config/config");
const order = db.order;
const user = db.user;
const product = db.product;
const payment = db.payment;
const supportTicket = db.supportTicket;
exports.getLatestActivity = async (req, res) => {
  try {
    const activities = [];

    // Latest Orders
    const orders = await order.findAll({
      attributes: ["id", "userId", "createdAt"],
      include: {
        model: user,
        as: "user",
        attributes: ["fullName"],
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    orders.forEach((o) => {
      activities.push({
        type: "order",
        message: `New order #${o.id} placed by ${
          o.customer?.fullName || "User"
        }`,
        time: o.createdAt,
      });
    });

    // Latest Users
    const users = await user.findAll({
      attributes: ["id", "fullName", "userType", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    users.forEach((u) => {
      activities.push({
        type: "user",
        message: `New ${u.userType} ${u.fullName} registered`,
        time: u.createdAt,
      });
    });

    // Latest Products
    const products = await product.findAll({
      attributes: ["id", "title", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    products.forEach((p) => {
      activities.push({
        type: "product",
        message: `New product "${p.title}" added`,
        time: p.createdAt,
      });
    });

    // Latest Payments
    const payments = await payment.findAll({
      attributes: ["id", "amount", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    payments.forEach((p) => {
      activities.push({
        type: "payment",
        message: `Payment of ₹${p.amount} received`,
        time: p.createdAt,
      });
    });

    // Latest Support Tickets
    const tickets = await supportTicket.findAll({
      attributes: ["id", "subject", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    tickets.forEach((t) => {
      activities.push({
        type: "ticket",
        message: `New support ticket: "${t.subject}" opened`,
        time: t.createdAt,
      });
    });

    // Sort all by time (descending)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.status(200).json({
      status: true,
      message: "Latest activity fetched successfully",
      data: activities,
    });
  } catch (err) {
    console.error("Error fetching activity:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching activity",
    });
  }
};
