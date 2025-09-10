// controllers/userController.js
const { Op } = require("sequelize");
const db = require("../../../config/config");

const User = db.user;

const get_allUserAdmin = async(req,res)=>{
  try {
    const { user_type, createdByUserId } = req.query;
    const whereCondition = {};

    if (user_type) {
      whereCondition.user_type = user_type;
    }

    if (createdByUserId) {
      whereCondition.createdByUserId = createdByUserId;
    }
    const totalUsers = await User.findAll({
      where: whereCondition,
      order: [['id', 'DESC']],
      attributes: ['id','user_type', 'name', 'phone_no','email_id','login_from','show_password']

    });
    if (totalUsers) {
      return res.status(200).json({
        status: true,
        message: "user retrieve Successfully",
        data: totalUsers,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "User not found ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
 
  module.exports = {
    get_allUserAdmin
}
