const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../../config/config.js");

const autoMarkDelivered = async () => {
  console.log("Running cron to check delivered suborders...");

  try {
    const pendingOrders = await db.Order.findAll({
      where: {
        orderStatus: { [Op.ne]: "delivered" },
      },
      include: [
        {
          model: db.SubOrder,
          as: "suborders",
          attributes: ["id", "orderStatus"],
        },
      ],
    });

    for (const order of pendingOrders) {
      const allDelivered = order.suborders.every(
        (sub) => sub.orderStatus === "delivered"
      );

      if (allDelivered) {
        await order.update({ orderStatus: "delivered" });
        console.log(`Order ${order.id} marked as delivered`);
      }
    }

    console.log("Auto-mark delivered job completed.");
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
};

// Run every 15 minutes (you can adjust this as needed)
cron.schedule("0 2 * * *", autoMarkDelivered);

module.exports = autoMarkDelivered;
