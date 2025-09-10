// utils/notifications/sendOrderEmails.js
const db = require("../../../config/config");
const { sendEmail } = require("../../services/sendOrderMail"); // Adjust path as per your structure
const user = db.user;
module.exports = async function sendOrderEmails({
  orderId,
  userId,
  itemsBySeller,
  finalAmount,
}) {
  try {
    const buyer = await user.findByPk(userId, {
      attributes: ["fullName", "email"],
    });

    // ✅ Send email to Buyer
    await sendEmail({
      to: buyer.email,
      subject: "Your order has been placed successfully!",
      html: `
        <h3>Hello ${buyer.fullName},</h3>
        <p>Thank you for your order. Your order ID is <strong>${orderId}</strong>.</p>
        <p>Total: ₹${finalAmount}</p>
        <p>We'll notify you once it's shipped.</p>
        <p>Thanks,<br/>Your Store Team</p>
      `,
    });

    // ✅ Send email to each Seller
    const sellerIds = Object.keys(itemsBySeller);

    for (const sellerId of sellerIds) {
      const seller = await user.findByPk(sellerId, {
        attributes: ["fullName", "email"],
      });

      const sellerItems = itemsBySeller[sellerId]
        .map(
          (item) => `
          <li>
            Product ID: ${item.productId}<br/>
            Quantity: ${item.quantity}<br/>
            Price: ₹${item.finalPrice}
          </li>
        `
        )
        .join("");

      await sendEmail({
        to: seller.email,
        subject: `New Order Received - Order #${orderId}`,
        html: `
          <h3>Hello ${seller.fullName},</h3>
          <p>You have received a new order. Order ID: <strong>${orderId}</strong></p>
          <p>Items:</p>
          <ul>${sellerItems}</ul>
          <p>Please login to your seller dashboard to fulfill this order.</p>
          <p>Thanks,<br/>Your Store Team</p>
        `,
      });
    }
  } catch (err) {
    console.error("📧 Error sending order emails:", err.message);
    // You can log this error or continue depending on criticality
  }
};
