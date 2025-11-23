import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// Get current user's wishlist (or empty array)
export const getMyWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.json({ items: [] });

    let wishlist = await Wishlist.findOne({ user: userId }).populate("items.product");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authorized" });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    const exists = wishlist.items.find(i => i.product.toString() === productId);
    if (exists) return res.status(200).json({ message: "Already in wishlist", wishlist });

    wishlist.items.push({ product: productId });
    await wishlist.save();
    await wishlist.populate("items.product");

    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(i => i.product.toString() !== productId);
    await wishlist.save();
    await wishlist.populate("items.product");

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = [];
    await wishlist.save();

    res.json({ message: "Wishlist cleared", wishlist });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear wishlist" });
  }
};
