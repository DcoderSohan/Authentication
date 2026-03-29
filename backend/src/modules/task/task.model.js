import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [1, "Title cannot be empty"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"],
        default: ""
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "in-progress", "completed"],
            message: "Status must be pending, in-progress, or completed"
        },
        default: "pending"
    },
    priority: {
        type: String,
        enum: {
            values: ["low", "medium", "high"],
            message: "Priority must be low, medium, or high"
        },
        default: "medium"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Index for faster queries by user
taskSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Task", taskSchema);