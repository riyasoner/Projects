const { where, Op } = require("sequelize");
const db = require("../../../config/config");
const User = db.user;
const Notification = db.notification;

exports.view_notification = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Validating request
    if (!user_id) {
      return res.status(200).json({
        status: false,
        message: "user_id is required",
      });
    }

    // Checking if user exists
    const checkUser = await User.findOne({ where: { id: user_id } });
    if (!checkUser) {
      return res.status(200).json({
        status: false,
        message: "User not found",
        data:[]
      });
    }

    let notification;
    let count;

    count = await Notification.findAndCountAll({
      where: { UserId: user_id, is_read: 0 },
    });

    // if (count.count > 0) {
      
    //   // Updating notification status is_read = 1

    //   await Notification.update({ is_read: 1 }, { where: { UserId: user_id } });
    // }
    notification = await Notification.findAll({
      where: {
        UserId: user_id,
      },
      order: [["id", "DESC"]],
      
    });


    if (notification) {
      return res.status(200).json({
        status: true,
        message: "All user notifications",
        data: notification,
       
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "No notifications found for the user",
        data: notification,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.get_all_notification = async(req, res) => {
    try {
        const { userId,transaction_id } = req.query;
        const whereCondition = {};

        if (userId) {
            whereCondition.userId = { [Op.eq]: userId };
        }
        if (transaction_id) {
          whereCondition.transaction_id = { [Op.eq]: transaction_id };
      }
        const getAllNotification = await Notification.findAll({ 
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "user", 
                    attributes: ["id", "name", "email_id", "phone_no"], // Specify required user fields
                },
            ],
        order: [["id", "DESC"]],
        
        })
    ;
        if(getAllNotification){
            return res.status(200).json({
                status : true,
                message: "Notification retrieved successfully",
                data : getAllNotification,
               
            })
        }
        else{
            return res.status(400).json({
                status : false,
                message : "notification not found "
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

exports.update_notification = async (req, res) => {
  try {
    const { user_id } = req.body;
   
    // Validating request
    if (!user_id) {
      return res.status(200).json({
        status: false,
        code: 201,
        message: "user_id is required",
        data: req.body,
      });
    }

    // Checking if user exists
    const checkUser = await User.findOne({ where: { id: user_id } });
    if (!checkUser) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }

    let count;

    count = await Notification.findAndCountAll({
      where: { UserId: user_id, is_read: 0 },
    });

    if (count.count > 0) {
    
      await Notification.update({ is_read: 1 }, { where: { UserId: user_id } });
    }
   
      return res.status(200).json({
        status: true,
        message: "Notification Update Successfully",
       
      });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
