import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user._id, user.role);

        res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
        } else {
        res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
