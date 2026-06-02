import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const checkTokenAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Token not found, please login again" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECERET)
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

export default checkTokenAuth
