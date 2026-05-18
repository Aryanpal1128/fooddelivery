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

// Import Models directly to ensure they are registered
import Shop from './models/shop.model.js';
import Item from './models/item.model.js';
import usermodel from './models/usermodel.js';
import Order from './models/order.model.js';

import authrouter from './routes/auth.routes.js';
import userrouter from './routes/userrouter.js';
import shoprouter from "./routes/shop.routes.js";
import itemrouter from "./routes/item.routes.js";
import orderrouter from "./routes/order.routes.js";

const app = express();
const port = process.env.PORT || 5000;

// Set bufferCommands to false to prevent query buffering timeouts
mongoose.set('bufferCommands', false);

// Middleware to prevent any requests from processing if the DB connection is not ready
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "Database connection is not established yet. Please try again later."
        });
    }
    next();
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

// Robust MongoDB connection with retry handling
const connectWithRetry = async (retries = 5, delay = 5000) => {
    const mongoURI = process.env.MONGO_URL || "mongodb://localhost:27017/fooddelivery";
    
    for (let i = 1; i <= retries; i++) {
        try {
            console.log(`⏳ Attempting MongoDB connection (Attempt ${i}/${retries})...`);
            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("✅ MongoDB Connected Successfully!");
            return;
        } catch (err) {
            console.error(`❌ MongoDB connection attempt ${i} failed. Error:`, err.message);
            if (i < retries) {
                console.log(`⏳ Waiting ${delay / 1000} seconds before next retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw err;
            }
        }
    }
};

// Startup architecture refactoring
async function startServer() {
    try {
        // 1. Verify Render Environment Variables load correctly
        console.log("🔍 Verifying Environment Variables:");
        console.log("- MONGO_URL:", process.env.MONGO_URL ? "✅ Loaded" : "❌ Missing");
        console.log("- JWT_KEY:", process.env.JWT_KEY ? "✅ Loaded" : "❌ Missing");
        console.log("- PORT:", process.env.PORT ? "✅ Loaded" : "⚠️ Missing (using default 5000)");

        // 2. Fully await database connection
        await connectWithRetry();

        // 3. Verify models initialize correctly after connection
        console.log("🔍 Initializing/Verifying models...");
        console.log("- Shop model registered:", !!mongoose.models.shop || !!mongoose.model('shop'));
        console.log("- Item model registered:", !!mongoose.models.item || !!mongoose.model('item'));
        console.log("- User model registered:", !!mongoose.models.user || !!mongoose.model('user'));

        // 4. Test production database queries to ensure Render cold starts do not break them
        console.log("🔍 Testing production database queries...");
        try {
            const shopCount = await Shop.countDocuments();
            console.log(`- Shop collection query test: ✅ Success (Found ${shopCount} shops)`);
            
            const itemCount = await Item.countDocuments();
            console.log(`- Item collection query test: ✅ Success (Found ${itemCount} items)`);
            
            const userCount = await usermodel.countDocuments();
            console.log(`- User collection query test: ✅ Success (Found ${userCount} users)`);
            
            console.log("✅ All production database query tests passed successfully!");
        } catch (queryErr) {
            console.error("❌ Database query verification failed during startup:", queryErr.message);
        }

        // 5. Start Express server only after DB is fully ready and tested
        const server = app.listen(port, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${port}`);
        });

        server.on('error', (error) => {
            console.error('Server Startup Error:', error);
        });

    } catch (err) {
        console.error("❌ MongoDB connection failed / Startup aborted", err);
        process.exit(1);
    }
}

startServer();