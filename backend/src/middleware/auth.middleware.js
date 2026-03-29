import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, error: "Token expired. Please login again." });
        }
        res.status(401).json({ success: false, error: "Invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, error: "Admin access required" });
    }
    next();
};