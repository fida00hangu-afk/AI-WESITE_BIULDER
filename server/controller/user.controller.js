import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'




export const google = async (req, res) => {
    try {
        const { name, email, avatar } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        // Find existing user or create new one
        let user = await User.findOne({ email }).lean()

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar
            })
            console.log("New user created:", user.email)
        } else {
            console.log("Existing user logged in:", user.email)
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECERET,
            { expiresIn: '7d' }
        )

        // Set secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Authentication successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                credits: user.credits,
                plan: user.plan
            }
        })
    } catch (error) {
        console.error('Google Auth Error:', error)
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        })
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        return res.status(500).json({ Message: `logout error ${error}` })
    }
}

export const getData = async (req, res) => {
    try {
        const userId = req.user.id  // from auth middleware

        const user = await User.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ user })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
