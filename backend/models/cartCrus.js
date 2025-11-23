// ===============================
// 📦 CartCrus — Model + Controller + Routes
// ===============================

import express from "express";
import mongoose from "mongoose";
import Product from "./productModel.js"; // <-- IMPORTANT: update path if needed

const router = express.Router();

/* ======================================================
   🟩 CART MODEL
====================================================== */

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1, min: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

/* ======================================================
   🟦 CART CONTROLLERS (CRUD)
====================================================== */

// ➕ Add Item to Cart
async function addToCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const exists = cart.items.find(i => i.product.toString() === productId);
      if (exists) {
        exists.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json({ message: "Added to cart", cart });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 📥 Get User Cart
async function getCart(req, res) {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.json({ items: [] });

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ♻ Update Quantity
async function updateQuantity(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 🗑 Remove ONE item
async function removeItem(req, res) {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed", cart });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 🧹 Clear entire cart
async function clearCart(req, res) {
  try {
    const { userId } = req.params;

    await Cart.findOneAndDelete({ user: userId });

    res.json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ======================================================
   🟧 CART ROUTES
====================================================== */

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateQuantity);
router.delete("/remove", removeItem);
router.delete("/clear/:userId", clearCart);

/* ======================================================
   🟪 EXPORT EVERYTHING AS CartCrus
====================================================== */

export const CartCrus = {
  Cart,
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
  router
};

export default router;
