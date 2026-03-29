import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/task/task.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" })); // Limit body size for security

// API v1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ success: true, message: "API is running", version: "1.0.0" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Internal server error"
    });
});

export default app;