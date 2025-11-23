import express from "express";
import PurchasesHistory from "../models/purchasesHistory.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST a new purchase log (protected)
router.post("/add/purchase", protect, async (req, res) => {
  // Make sure req.body exists
  const { user, action, details, date } = req.body || {};

  // Validate required fields
  if (!user || !action) {
    return res.status(400).json({ error: "Missing required fields: user or action" });
  }

  try {
    const newLog = await PurchasesHistory.create({
      user,
      action,
      details: details || "",
      date: date || new Date(),
    });
    res.status(201).json(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create purchase history" });
  }
});

export default router;
