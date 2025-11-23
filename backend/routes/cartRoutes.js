import express from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// GET user's cart
router.get("/me", getCart);

// POST - Add item to cart
router.post("/add", addToCart);

// PUT - Update item quantity
router.put("/update", updateCartItem);

// DELETE - Remove item from cart
router.delete("/remove", removeFromCart);

// DELETE - Clear entire cart
router.delete("/clear", clearCart);

export default router;
