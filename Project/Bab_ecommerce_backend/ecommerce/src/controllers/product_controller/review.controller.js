const db = require("../../../config/config");
const review = db.review;
const product = db.product;
const user = db.user;
const Order = db.order;
const OrderItem = db.orderitem;

exports.addOrUpdateReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    const reviewImage = req.file ? `reviewImage/${req.file.filename}` : null;
    console.log(reviewImage);
    const productExists = await product.findByPk(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    const existingReview = await review.findOne({
      where: { userId, productId },
    });

    let result;
    if (existingReview) {
      await existingReview.update({ rating, comment, reviewImage });
      result = existingReview;
    } else {
      result = await review.create({
        userId,
        productId,
        rating,
        comment,
        reviewImage,
      });
    }

    return res.status(200).json({
      status: true,
      message: existingReview ? "Review updated" : "Review added",
      data: result,
    });
  } catch (err) {
    console.error("Error saving review:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await review.findAll({
      where: { productId },
      include: [
        {
          model: user,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const host = `${req.protocol}://${req.get("host")}`;

    const formattedReviews = reviews.map((item) => {
      return {
        ...item.toJSON(),
        reviewImage: item.reviewImage ? `${host}/${item.reviewImage}` : null,
      };
    });

    return res.status(200).json({
      status: true,
      data: formattedReviews,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await review.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Review not found" });
    }

    return res.status(200).json({ status: true, message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.canUserRate = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        status: false,
        message: "userId and productId are required",
      });
    }

    const deliveredOrder = await Order.findOne({
      where: { userId, orderStatus: "delivered" },
      include: [
        {
          model: OrderItem,
          as: "items",
          where: { productId },
        },
      ],
    });

    if (!deliveredOrder) {
      return res.status(200).json({
        status: false,
        message: "User has not purchased this product, cannot give a rating",
      });
    }

    // Step 2: Check if already rated
    const alreadyRated = await review.findOne({
      where: { userId, productId },
    });

    if (alreadyRated) {
      return res.status(200).json({
        status: false,
        message: "User has already given a rating for this product",
      });
    }

    // Step 3: Allow rating
    return res.status(200).json({
      status: true,
      message: "User is allowed to give a rating",
    });
  } catch (error) {
    console.error("Error checking rating permission:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
