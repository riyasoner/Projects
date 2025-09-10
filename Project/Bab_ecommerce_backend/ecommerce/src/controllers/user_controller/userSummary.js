const { user: User, Sequelize } = require("../../../config/config");
const { Op } = Sequelize;
const { fn, col, where } = Sequelize;

// @desc    Get user summary counts
// @route   GET /api/admin/user-summary
// @access  Admin
const getUserSummary = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalUsers, newUsers, activeSellers, verifiedUsers] =
      await Promise.all([
        User.count(),
        User.count({
          where: where(fn("DATE", col("createdAt")), "=", fn("CURDATE")),
        }),
        User.count({ where: { userType: "seller", status: "active" } }),
        User.count({ where: { isVerified: true } }),
      ]);

    return res.status(200).json({
      status: true,
      message: "User summary fetched successfully",
      data: {
        totalUsers,
        newUsers,
        activeSellers,
        verifiedUsers,
      },
    });
  } catch (error) {
    console.error("[User Summary Error]:", error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch user summary",
    });
  }
};

module.exports = { getUserSummary };
