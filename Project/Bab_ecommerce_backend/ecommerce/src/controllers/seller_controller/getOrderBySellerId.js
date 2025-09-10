const db = require("../../../config/config");
const Order = db.order;
const SubOrder = db.suborder;
const OrderItem = db.orderitem;
const User = db.user;
const Address = db.address;
const Product = db.product; // Assuming OrderItem is linked to Product

exports.getOrdersBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    if (!sellerId) {
      return res.status(400).json({
        message: "Seller ID is required",
        status: false,
      });
    }

    const totalSubOrders = await SubOrder.count({ where: { sellerId } });

    const suborders = await SubOrder.findAll({
      where: { sellerId },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Order,
          as: "order",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "fullName", "email", "phoneNo"],
            },
            {
              model: Address,
              as: "shippingAddress",
              attributes: [
                "fullName",
                "phoneNumber",
                "city",
                "state",
                "postalCode",
                "addressLine1",
                "addressLine2",
              ],
            },
          ],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    const updatedSuborders = suborders.map((sub) => {
      const updatedItems = sub.items.map((item) => {
        let images = [];
        try {
          images = JSON.parse(item.product?.images || "[]");
        } catch (e) {
          console.error("Error parsing images:", e);
        }

        return {
          ...item.dataValues,
          productName: item.product?.title || null,
          price: item.product?.price || null,
          imageUrl: images.length > 0 ? `${hostUrl}${images[0]}` : null,
        };
      });

      return {
        ...sub.dataValues,
        items: updatedItems,
      };
    });

    return res.status(200).json({
      message: "Orders fetched successfully",
      status: true,
      currentPage: page,
      totalPages: Math.ceil(totalSubOrders / limit),
      totalSubOrders,
      suborders: updatedSuborders,
    });
  } catch (error) {
    console.error("Get Orders By Seller Error:", error);
    return res.status(500).json({
      message: "Server error while fetching orders",
      status: false,
    });
  }
};
