import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/home.css";
import getFallbackImage from '../../utils/imageFallback';
import AuthPromptModal from '../../components/AuthPromptModal';
import { useToast } from '../../components/ToastProvider';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const data = res.data || [];
      // Get first 4 products as featured
      setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
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
      console.error("Error:", err);
      toast.show("Failed to add to cart", { type: 'danger' });
    }
  };

  return (
    <div className="home-page">
      <div className="app-container">
        <section className="hero-section">
          <div className="hero-left">
            <h3 className="banner-brand">AUREVRA</h3>
            <h1>Timeless Jewelry, Modern Minimalism</h1>
            <p className="muted">Handcrafted pieces inspired by classic forms — perfect for everyday elegance.</p>
            <div className="hero-cta" style={{marginTop:16}}>
              <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
              <Link to="/aboutus" className="btn btn-ghost">Our Story</Link>
            </div>
          </div>

          <div className="hero-right">
            {/* Spotlight card */}
            <div className="card" style={{padding:0}}>
              <div className="card-media">
                <img src={(products[0] && (products[0].image || products[0].photo)) ? (products[0].image || products[0].photo) : getFallbackImage('banner')} alt="Featured" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="section daily-discovery">
          <h2>Featured Collection</h2>

          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center">No products available</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card card">
                  <div className="card-media">
                    <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                  </div>
                  <div className="card-body">
                    <h4>{product.name}</h4>
                    <div className="meta"><p className="price">₱{(product.price || 0).toLocaleString()}</p></div>
                    <p className="muted" style={{fontSize:'.95rem'}}>{product.description || ''}</p>
                    <div style={{marginTop:10}} className="product-actions">
                      <button className="btn btn-primary" onClick={() => addToCart(product._id)}>Add to cart</button>
                      <Link to={`/product/${product._id}`} className="btn btn-ghost">View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="center" style={{marginTop:28}}>
            <Link to="/shop" className="btn btn-primary">View All Products</Link>
          </div>
        </section>

        <AuthPromptModal show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      </div>
    </div>
  );
}