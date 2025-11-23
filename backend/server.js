import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import productHistoryRoutes from "./routes/productHistoryRoute.js";
import purchaseHistoryRoutes from "./routes/purchaseHistoryRoute.js";
import userHistoryRoutes from "./routes/userHistoryRoute.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/history/products", productHistoryRoutes);
app.use("/api/history/purchases", purchaseHistoryRoutes);
app.use("/api/history/users", userHistoryRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
