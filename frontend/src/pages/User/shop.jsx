import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/shop.css";
import AuthPromptModal from "../../components/AuthPromptModal";
import { useToast } from '../../components/ToastProvider';
import getFallbackImage from '../../utils/imageFallback';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, priceRange, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      let allProducts = res.data.products || res.data || [];
      
      setProducts(allProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
      setCategories(["All", ...uniqueCategories]);
      
      // Set initial price range
      if (allProducts.length > 0) {
        const prices = allProducts.map(p => p.price);
        setPriceRange([0, Math.max(...prices)]);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = async (productId) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post("/api/cart/add", { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.show("Added to cart!", { type: 'success' });
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.show("Failed to add to cart", { type: 'danger' });
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post("/api/wishlist/add", { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.show("Added to wishlist!", { type: 'success' });
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.show(err.response?.data?.message || "Failed to add", { type: 'danger' });
    }
  };

  return (
    <div className="shop-page">
      <div className="app-container">
        <h2 className="page-title">
          {searchQuery ? `Search results for "${searchQuery}"` : "All Jewelry"}
        </h2>

        {/* Filters */}
        <div className="filters-section" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
          padding: '20px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Price Range: ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading items...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <div className="product-card card" key={p._id}>
                <div className="card-media">
                  <img src={p.image || getFallbackImage(p.name)} alt={p.name} loading="lazy" />
                  <button 
                    className="wishlist-btn"
                    onClick={() => addToWishlist(p._id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="card-body">
                  <h4>{p.name}</h4>
                  <div className="meta">
                    <p className="price">₱{(p.price || 0).toLocaleString()}</p>
                  </div>
                  <p className="muted" style={{fontSize: '0.95rem'}}>{p.description || ""}</p>

                  <div className="product-actions">
                    <button className="btn btn-primary" onClick={() => addToCart(p._id)}>
                      Add to cart
                    </button>
                    <button className="btn btn-ghost" onClick={() => navigate(`/product/${p._id}`)}>
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <AuthPromptModal show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      </div>
    </div>
  );
}