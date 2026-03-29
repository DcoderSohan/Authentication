import { User } from "../user/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Input validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, error: "Name is required" });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: "Invalid email format" });
        }

        const exist = await User.findOne({ email: email.toLowerCase().trim() });
        if (exist) {
            return res.status(409).json({ success: false, error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user"
        });

        // Don't return password in response
        const userResponse = { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Don't return password in response
        const userResponse = { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userResponse,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
};