import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Check if MONGODB_URI is loaded
if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not set in .env file");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ Database connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1); // Stop the server if DB fails
    });