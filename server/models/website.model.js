import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["ai", "user"]
    },
    content: {
        type: String,
        required: true
    }
})
const webSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: "Untitled Website"
    },
    latestCode: {
        type: String,
        required: true
    },
    conversation: [messageSchema],
    deploy: {
        type: Boolean,
        default: false
    },
    deployurl: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })
const Website = mongoose.model("Website", webSchema)
export default Website
