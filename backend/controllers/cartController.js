import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// GET - Fetch user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST - Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: quantity || 1 }]
      });
    } else {
      // Check if product already exists in cart
      const existingItem = cart.items.find(i => i.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }

      await cart.save();
    }

    res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT - Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE - Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE - Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
