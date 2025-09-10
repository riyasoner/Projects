const db = require('../../../config/db.config')
const user = db.User;


exports.updateDeviceId = async(req, res)=>{
     const { id, device_id } = req.body
     try {
        const updateDevice = await user.findOne({
            where : {
                id : id
            }
        })
        let findDevice;
        if(updateDevice){
           findDevice = updateDevice.device_id
        }
        if(findDevice !== device_id){
            const brade = await user.update(
                {
                  device_id: device_id,
                },
                {
                    where : {
                        id : id
                    }
                })
                return res.status(200).json({
                    status : true,
                    message : "Device Id updated successfully",
                    data : brade
                })
        }else{
            return res.status(200).json({
                status : true,
                message : "DeviceId is not required for update"
            })
        }
     } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
     }
}
