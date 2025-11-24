import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import productHistoryRoutes from "./routes/productHistoryRoute.js";
import purchaseHistoryRoutes from "./routes/purchaseHistoryRoute.js";
import userHistoryRoutes from "./routes/userHistoryRoute.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // NEW

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/history/products", productHistoryRoutes);
app.use("/api/history/purchases", purchaseHistoryRoutes);
app.use("/api/history/users", userHistoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes); // NEW

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${process.cwd()}/uploads`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});