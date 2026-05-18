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

const app = express();
const port = process.env.PORT || 5000;

// Critical Fix: Disable buffering globally before any other mongoose/model logic
mongoose.set('bufferCommands', false);

// Event listeners for Mongoose connection events
mongoose.connection.on('connected', () => {
    console.log('💚 MongoDB event: connected');
});
mongoose.connection.on('disconnected', () => {
    console.log('💔 MongoDB event: disconnected');
});
mongoose.connection.on('reconnecting', () => {
    console.log('⏳ MongoDB event: reconnecting');
});
mongoose.connection.on('error', (err) => {
    console.error('💥 MongoDB event: error', err);
});

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

// Health check endpoint (Render uses this to verify the service is running)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Startup architecture refactoring
async function startServer() {
    try {
        // 1. Verify Render Environment Variables load correctly
        console.log("🔍 Verifying Environment Variables:");
        console.log("- MONGO_URL:", process.env.MONGO_URL ? "✅ Loaded" : "❌ Missing");
        console.log("- JWT_KEY:", process.env.JWT_KEY ? "✅ Loaded" : "❌ Missing");
        console.log("- PORT:", process.env.PORT ? "✅ Loaded" : "⚠️ Missing (using default 5000)");

        const mongoURI = process.env.MONGO_URL || "mongodb://localhost:27017/fooddelivery";
        
        // 2. Fully await database connection
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // 10s selection timeout
        });
        console.log("✅ MongoDB Connected Successfully!");

        // 3. Dynamic Import of Routes and Models AFTER DB is fully connected
        console.log("🔍 Dynamic importing routes and models...");
        
        // Import models directly to ensure registration
        const { default: Shop } = await import('./models/shop.model.js');
        const { default: Item } = await import('./models/item.model.js');
        const { default: usermodel } = await import('./models/usermodel.js');
        const { default: Order } = await import('./models/order.model.js');

        // Import routers
        const { default: authrouter } = await import('./routes/auth.routes.js');
        const { default: userrouter } = await import('./routes/userrouter.js');
        const { default: shoprouter } = await import('./routes/shop.routes.js');
        const { default: itemrouter } = await import('./routes/item.routes.js');
        const { default: orderrouter } = await import('./routes/order.routes.js');

        // Verify models register correctly
        console.log("- Shop model registered:", !!mongoose.models.shop);
        console.log("- Item model registered:", !!mongoose.models.item);
        console.log("- User model registered:", !!mongoose.models.user);

        // Test production database queries to ensure Render cold starts do not break them
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

        // Mount routers
        app.use("/api/auth", authrouter);
        app.use("/api/user", userrouter);
        app.use("/api/shop", shoprouter);
        app.use("/api/item", itemrouter);
        app.use("/api/order", orderrouter);

        // Global error handler for Express routes
        app.use((err, req, res, next) => {
            console.error("Route Crash:", err.stack);
            res.status(500).json({ message: "Internal Server Error" });
        });

        // 4. Start Express server ONLY after DB is fully ready and tested
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