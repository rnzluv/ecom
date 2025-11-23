import AdminCreatedHistory from "../models/adminCreatedHistory.js";
import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this name already exists" });
    }

    const newProduct = await Product.create({
      name,
      description: description || "",
      price,
      category: category || "",
      stock: stock || 0,
      image,
    });
    
    // --- LOG ADMIN ACTION ---
    await AdminCreatedHistory.create({
      admin: req.user?.name || "admin123", // replace with real admin info from auth
      action: "Added Product",
      details: `Added product: ${name}`,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // --- LOG ADMIN ACTION ---
    await AdminCreatedHistory.create({
      admin: req.user?.name || "admin123", // replace with real admin info from auth
      action: "Deleted Product",
      details: `Deleted product: ${product.name}`,
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Get Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Apply updates
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;

    if (image) {
      product.image = image;
    }

    const updatedProduct = await product.save();

    // --- LOG ADMIN ACTION ---
    await AdminCreatedHistory.create({
      admin: req.user?.name || "admin123",
      action: "Updated Product",
      details: `Updated product: ${updatedProduct.name}`,
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getProducts = async (req, res) => {
  try {
    let { search, category, page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Fetch products
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    // Count total products for frontend
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });

  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ message: err.message });
  }
};
