const jwt = require("jsonwebtoken")
const db = require("../../config/config")
const User = db.User;
const generateToken = require("../services/genrateToken")
const access_secret_key = process.env.ACCESS_SECRET_KEY
const refresh_secret_key = process.env.REFRESH_SECRET_KEY

exports.authorize = (requiredUserType) => {
    
    return async (req, res, next) => {
        const auth_header = req.headers['authorization']

        if (!auth_header) {
            return res.status(401).json({ message: 'Authorization header missing' })
        }
        const token = auth_header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Bearer token missing' });
        }

        try {
            const decodedToken = jwt.verify(token, access_secret_key);
            const user = await User.findByPk(decodedToken.id);

            if (!user) {
                return res.status(401).json({ message: 'Invalid access token' });
            }

            if (requiredUserType.length > 0) {
                for (let i = 0; i < requiredUserType.length; i++) {
                    if (requiredUserType[i] !== 'admin'
                     && requiredUserType[i] !== 'user'
                     ) {
                        return res.status(400).json({ message: "Permission denied" })
                    }
                }
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(401).json({ message: 'Invalid access token' });
        }
    };
};




