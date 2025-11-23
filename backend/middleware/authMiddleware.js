import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Optional authentication: if a valid JWT is provided, attach req.user.
// If no token is present or token is invalid, continue without error.
export const optionalAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
        }
    } catch (err) {
        // Invalid token — ignore and proceed as guest
        // Optionally log the error in production
    }

    return next();
};

// ⭐ ADD THIS — Admin only middleware
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }

    next();
};
