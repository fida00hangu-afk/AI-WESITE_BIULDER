import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    credits: {
        type: Number,
        default: 10000,
        min: 0
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprice'],
        default: 'free'
    }

}, { timestamps: true })

const User = mongoose.model("User", UserModel)

export default User