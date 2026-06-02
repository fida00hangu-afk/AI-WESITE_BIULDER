import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './config/db.js'
import router from './routes/user.routes.js'
import WebRouter from './routes/website.route.js'
import cookieParser from 'cookie-parser'
import compression from "compression"
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'

const app = express()

const port = process.env.PORT || 3000

// Production-ready Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})
app.use(morgan('dev')) // Request logging
app.use(helmet()) // Security headers
app.use(compression()) // Response compression

// Rate Limiting (Prevents DDoS/Brute-force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
})
app.use('/auth', limiter) // Only limit auth routes for now to allow normal usage

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

// Body parser with size limits
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Security Policy
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

// Routes
app.use('/auth/user', router)
app.use('/gen', WebRouter)



app.get('/', (req, res) => {
    console.log("hello")
    res.send("okay hai")
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.name}: ${err.message}`)

    if (err.name === 'PayloadTooLargeError') {
        return res.status(413).json({ success: false, message: 'Request body is too large' })
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
    connectDB()
})
