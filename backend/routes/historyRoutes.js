import express from "express";
import PurchasesHistory from "../models/purchasesHistory.js";
import UserCreatedHistory from "../models/userCreatedHistory.js";
import AdminCreatedHistory from "../models/adminCreatedHistory.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all history (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const purchased = await PurchasesHistory.find().sort({ date: -1 });
    const userCreated = await UserCreatedHistory.find().sort({ date: -1 });
    const adminCreated = await AdminCreatedHistory.find().sort({ date: -1 });

    res.json({ purchased, userCreated, adminCreated });
  } catch (err) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

// POST new history logs
router.post("/add/purchase", async (req, res) => {
  try {
    const log = await PurchasesHistory.create(req.body);
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Failed to add purchase history" });
  }
});

router.post("/add/user", async (req, res) => {
  try {
    const log = await UserCreatedHistory.create(req.body);
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user-created history" });
  }
});

router.post("/add/admin", async (req, res) => {
  try {
    const log = await AdminCreatedHistory.create(req.body);
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Failed to add admin-created history" });
  }
});

export default router;
