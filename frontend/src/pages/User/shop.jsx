import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/shop.css";
import AuthPromptModal from "../../components/AuthPromptModal";
import { useToast } from '../../components/ToastProvider';
import getFallbackImage from '../../utils/imageFallback';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const toast = useToast();

  // Extract ?search=keyword
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    loadProducts();
  }, [searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      let filtered = res.data || [];

      if (Array.isArray(filtered)) {
        if (searchQuery) {
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
      }

      setProducts(filtered);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    }
    setLoading(false);
  };

  const addToCart = async (productId) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post(
        "/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.show("Added to cart!", { type: 'success' });
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.show("Failed to add to cart", { type: 'danger' });
    }
  };

  return (
    <div className="shop-page">
      <div className="app-container">
        <h2 className="page-title">
          {searchQuery ? `Search results for "${searchQuery}"` : "All Jewelry"}
        </h2>

        {loading ? (
          <p className="text-center">Loading items...</p>
        ) : products.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div className="product-card card" key={p._id}>
                <div className="card-media">
                  <img src={p.image || getFallbackImage(p.name)} alt={p.name} loading="lazy" />
                </div>
                <div className="card-body">
                  <h4>{p.name}</h4>
                  <div className="meta">
                    <p className="price">₱{(p.price || 0).toLocaleString()}</p>
                  </div>
                  <p className="muted" style={{fontSize: '0.95rem'}}>{p.description || ""}</p>

                  <div className="product-actions">
                    <button className="btn btn-primary" onClick={() => addToCart(p._id)}>Add to cart</button>
                    <button className="btn btn-ghost" onClick={() => navigate(`/product/${p._id}`)}>View</button>
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
