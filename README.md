# Gamer GPT - AI Website Builder

Gamer GPT is a powerful AI-driven platform that allows users to generate production-ready, fully responsive, and modern websites in seconds using simple text prompts.

## 🚀 Features

- **AI Generation:** Describe your vision and get a complete website.
- **Live Monaco Editor:** Edit code directly in a VS Code-like interface.
- **Instant Preview:** See your changes in real-time.
- **Credits System:** Manage usage with a credit-based model.
- **Downloadable Code:** Export your generated website as a single HTML file.
- **History:** Keep track of all your generated projects.

## 🛠️ Tech Stack

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Framer Motion, Lucide React, Monaco Editor.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **AI Integration:** OpenRouter (DeepSeek Model).
- **Authentication:** Firebase Google Auth.

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/fida00hangu-afk/AI-WESITE_BIULDER.git
cd AI-WESITE_BIULDER
```

### 2. Backend Setup
- Navigate to the `server` folder: `cd server`
- Install dependencies: `npm install`
- Copy `.env.example` to `.env` and fill in your secrets.
- Start the server: `node index.js`

### 3. Frontend Setup
- Navigate to the `frontend` folder: `cd ../frontend`
- Install dependencies: `npm install`
- Copy `.env.example` to `.env` and fill in your Firebase keys.
- Start the development server: `npm run dev`

## 🔑 Environment Variables

Make sure to set up the following keys in your `.env` files:

### Server
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECERET`: A secure string for JWT tokens.
- `OPEN_ROUTER_API_KEY`: Your API key from OpenRouter.

### Frontend
- Firebase API Keys (from Firebase Console).
- `VITE_BACKEND_URL`: URL of your running backend server.

## 📜 License
This project is for educational purposes.
