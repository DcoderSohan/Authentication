import Task from "./task.model.js";

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, error: "Title is required" });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
            status: status || "pending",
            priority: priority || "medium",
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, error: messages.join(", ") });
        }
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// @desc    Get all tasks (user gets own, admin gets all)
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { user: req.user.id };

        const tasks = await Task.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// @desc    Get single task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("user", "name email").lean();

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        // Only owner or admin can view
        if (req.user.role !== "admin" && task.user._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(400).json({ success: false, error: "Invalid task ID" });
        }
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        // Only owner or admin can update
        if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        const { title, description, status, priority } = req.body;

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({ success: false, error: "Title cannot be empty" });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;

        task = await Task.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).populate("user", "name email");

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, error: messages.join(", ") });
        }
        if (error.kind === "ObjectId") {
            return res.status(400).json({ success: false, error: "Invalid task ID" });
        }
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        // Only owner or admin can delete
        if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: { id: req.params.id }
        });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(400).json({ success: false, error: "Invalid task ID" });
        }
        res.status(500).json({ success: false, error: "Server error" });
    }
};