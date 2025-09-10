// controllers/userController.js
const  db  = require('../../../config/db.config');
const User = db.User;
const follower = db.follower_count;


exports.addFollowUsers = async (req, res) => {
  const { expert_id, user_id } = req.body;
  try {
    // Find the expert by ID
    const expert = await User.findByPk(expert_id);

    // If expert is not found, return error
    if (!expert) {
      return res.json({
        status: false,
        message: 'Expert not found',
      });
    }

    // Find the user by ID
    const user = await User.findByPk(user_id);

    // If user is not found, return error
    if (!user) {
      return res.json({
        status: false,
        message: 'User not found',
      });
    }

    // Check if the user is already following the expert
    const isFollowing = await follower.findOne({
      where: {
        user_id: user_id,
        expert_id: expert_id,
      }
    });

    // If the user is already following the expert, unfollow
    if (isFollowing) {
      // Decrement the follow count for the expert
      const newCount = expert.follow_count - 1;
      await expert.update({ follow_count: newCount });

      // Delete the follower entry
      await follower.destroy({
        where: {
          user_id: user_id,
          expert_id: expert_id,
        }
      });

      return res.json({
        status: true,
        message: 'Expert unfollowed',
        expert_follower_count: newCount,
        isFollowing: false,
      });
    } else {
      // Increment the follow count for the expert
      const newCount = expert.follow_count + 1;
      await expert.update({ follow_count: newCount });

      // Create a new follower entry
      await follower.create({
        user_id: user_id,
        expert_id: expert_id,
      });

      return res.json({
        status: true,
        message: 'Expert followed',
        expert_follower_count: newCount,
        isFollowing: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.check_is_following = async(req, res) => {
  try{
    const { expert_id, user_id } = req.body;
     // Find the expert by ID
     const expert = await User.findByPk(expert_id);

     // If expert is not found, return error
     if (!expert) {
       return res.json({
         status: false,
         message: 'Expert not found',
       });
     }
 
     // Find the user by ID
     const user = await User.findByPk(user_id);
 
     // If user is not found, return error
     if (!user) {
       return res.json({
         status: false,
         message: 'User not found',
       });
     }
 
     // Check if the user is already following the expert
     const isFollowing = await follower.findOne({
       where: {
         user_id: user_id,
         expert_id: expert_id,
       }
     });
     if(isFollowing) {
      return res.json({
        status: true,
        message: 'following',
        isFollowing: true,
      });
     }
     else{
      return res.json({
        status: false,
        message: 'Not following',
        isFollowing: false,
      });
     }

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
