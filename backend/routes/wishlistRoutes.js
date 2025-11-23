import express from "express";
import { getMyWishlist, addToWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishlistController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET - user's wishlist. Use optionalAuth so guests get an empty list rather than 401.
router.get("/me", optionalAuth, getMyWishlist);

// POST - add to wishlist (must be authenticated)
router.post("/add", protect, addToWishlist);

// DELETE - remove from wishlist (must be authenticated)
router.delete("/remove", protect, removeFromWishlist);

// DELETE - clear wishlist
router.delete("/clear", protect, clearWishlist);

export default router;
