const db = require('../../../config/config');
const user = db.user;

// API for logout user
const userLogOut = async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User ID is required"
            });
        }

        const findUser = await user.findOne({
            where: { id: userId }
        });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // ✅ Clear refresh token and save changes
        await user.update(
            { refreshToken: null }, 
            { where: { id: userId } }
        );

        return res.status(200).json({
            status: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

module.exports = {
    userLogOut
};
