import express from "express";
import ProductHistory from "../models/ProductHistory.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all product logs (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const logs = await ProductHistory.find().populate("adminId productId");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product history" });
  }
});

export default router;
