import express from "express";
import UserCreatedHistory from "../models/userCreatedHistory.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all user creation logs (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const logs = await UserCreatedHistory.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user history" });
  }
});

export default router;
