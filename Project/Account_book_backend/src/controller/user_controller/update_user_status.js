const { where } = require("sequelize");
const db = require("../../../config/db.config")
const User = db.User

const update_user_status = async(req,res)=>{
    try{
        const {user_id,user_status} = req.query;
        const find_user = await User.findOne({
            where:{id:user_id}
        })
        if(!find_user){
        return res.status(200).json({status:false,message:"User not found"})
        }
        const update_status = await User.update(
            { user_status: user_status },
            { where: { id: user_id } }
          );

        return res.status(200).json({status:true,message:"User status updated succsesfully"})

    }catch(error){
        return res.status(500).json({status:false,message:error.message})
    }
}

module.exports = { update_user_status }