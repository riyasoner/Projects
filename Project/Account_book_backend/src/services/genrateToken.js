const jwt = require("jsonwebtoken")
const access_secret_key = process.env.ACCESS_SECRET_KEY
const refresh_secret_key = process.env.REFRESH_SECRET_KEY

const generateAccessToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jwt.sign(payload, access_secret_key, { expiresIn: '1m' });
};

const generateRefreshToken = () => {
    return jwt.sign({}, refresh_secret_key, { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken }