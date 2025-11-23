import express from "express";
import multer from "multer";
import fs from "fs";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect, adminOnly, optionalAuth } from "../middleware/authMiddleware.js";
import Product from "../models/productModel.js";

const router = express.Router();

/* -------------------------------------------------
   Ensure /uploads folder exists
------------------------------------------------- */
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* -------------------------------------------------
   Multer Storage
------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* -------------------------------------------------
   PRODUCT ROUTES
------------------------------------------------- */
router.get("/", optionalAuth, getProducts);
router.get("/:id", optionalAuth, getProductById);

router.post(
  "/add",
  protect,
  adminOnly,
  upload.single("image"),
  addProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);
// GET /api/products/search?q=keyword
router.get("/search", optionalAuth, async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const results = await Product.find({
      name: { $regex: keyword, $options: "i" } // case-insensitive
    }).limit(10);

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
