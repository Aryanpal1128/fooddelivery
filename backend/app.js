import "dotenv/config";

// 1. Add Global Error Handlers First
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥');
    console.error(err.name, err.message, err.stack);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err.name, err.message, err.stack);
});

import express from 'express';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authrouter from './routes/auth.routes.js';
import userrouter from './routes/userrouter.js';
import shoprouter from "./routes/shop.routes.js";
import itemrouter from "./routes/item.routes.js";
import orderrouter from "./routes/order.routes.js";

const app = express();
const port = process.env.PORT || 5000;

// Safe DB Connection
const mongoURI = process.env.MONGO_URL || "mongodb://localhost:27017/fooddelivery";
mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => { console.log("✅ MongoDB Connected Successfully") })
    .catch((err) => { 
        console.error("❌ MongoDB Connection Error:", err.message);
    });

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            'content-type',
            'authorization',
            'cache-control',
            'expires',
            'pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Foodie API is running!' });
});

app.use("/api/auth", authrouter);
app.use("/api/user", userrouter);
app.use("/api/shop", shoprouter);
app.use("/api/item", itemrouter);
app.use("/api/order", orderrouter);

// Health check endpoint (Render uses this to verify the service is running)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Global error handler for Express routes
app.use((err, req, res, next) => {
    console.error("Route Crash:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server binding to 0.0.0.0 for Render
const server = app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port}`);
});

server.on('error', (error) => {
    console.error('Server Startup Error:', error);
});