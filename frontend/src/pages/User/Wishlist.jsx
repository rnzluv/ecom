import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthPromptModal from '../../components/AuthPromptModal';
import getFallbackImage from '../../utils/imageFallback';
import { useToast } from '../../components/ToastProvider';
import Skeleton from '../../components/Skeleton';
import ConfirmModal from '../../components/ConfirmModal';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      if (token) {
        try {
          const res = await axios.get("/api/wishlist/me", { headers: { Authorization: `Bearer ${token}` } });
          // API returns a wishlist object { items: [ { product: {...} } ] }
          const items = (res.data && res.data.items) ? res.data.items.map(i => (i.product ? i.product : i)) : [];
          setWishlistItems(items);
        } catch (err) {
          console.error("Failed to load wishlist from server:", err);
          const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
          setWishlistItems(saved);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistItems(saved);
      }
      setLoading(false);
    };

    load();
  }, []);

  const handleRemove = (id) => {
      if (token) {
      // server-side remove
      axios.delete("/api/wishlist/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId: id }
      }).then(res => {
        const items = (res.data && res.data.items) ? res.data.items.map(i => (i.product ? i.product : i)) : [];
        setWishlistItems(items);
      }).catch(err => {
        console.error("Failed to remove from wishlist:", err);
          toast && toast.show("Failed to remove from wishlist", { type: 'error' });
      });
    } else {
      const updated = wishlistItems.filter(item => item._id !== id);
      setWishlistItems(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
        toast && toast.show("Removed from wishlist", { type: 'info' });
    }
  };

  const handleAddToCart = async (item) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post(
        "/api/cart/add",
        { productId: item._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast && toast.show("Added to cart", { type: 'success' });
    } catch (err) {
      console.error("Error:", err);
      toast && toast.show("Failed to add to cart", { type: 'error' });
    }
  };

  const handleClearWishlist = () => {
    // Open confirmation modal
    setConfirmMessage('Clear entire wishlist? This action cannot be undone.');
    setConfirmAction(() => async () => {
      if (token) {
        try {
          await axios.delete("/api/wishlist/clear", { headers: { Authorization: `Bearer ${token}` } });
          setWishlistItems([]);
          toast.show("Wishlist cleared", { type: 'info' });
        } catch (err) {
          console.error("Failed to clear wishlist:", err);
          toast.show("Failed to clear wishlist", { type: 'danger' });
        }
      } else {
        setWishlistItems([]);
        localStorage.setItem("wishlist", JSON.stringify([]));
        toast.show("Wishlist cleared", { type: 'info' });
      }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  if (loading) return (
    <div className="app-container" style={{paddingTop:60}}>
      <h2 className="fw-bold mb-4">My Wishlist ❤️</h2>
      <div className="products-grid">
        <div className="card"><Skeleton height={180} /></div>
        <div className="card"><Skeleton height={180} /></div>
        <div className="card"><Skeleton height={180} /></div>
      </div>
    </div>
  );
      <ConfirmModal
        open={confirmOpen}
        title="Confirm"
        message={confirmMessage}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { if (confirmAction) confirmAction(); }}
      />

  return (
    <div className="app-container" style={{paddingTop:40}}>
      <h2 className="fw-bold mb-4">My Wishlist ❤️</h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center mt-5">
          <p>Your wishlist is empty. Start shopping!</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/shop") }>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {wishlistItems.map((item) => (
              <div key={item._id} className="product-card card">
                <div className="card-media">
                  <img src={item.image || getFallbackImage(item.name)} alt={item.name} loading="lazy" />
                </div>
                <div className="card-body">
                  <h4>{item.name}</h4>
                  <p className="muted" style={{fontSize:'.95rem'}}>{item.description}</p>
                  <div className="meta"><p className="price">₱{(item.price || 0).toLocaleString()}</p></div>
                  <div className="product-actions">
                    <button className="btn btn-primary" onClick={() => handleAddToCart(item)}>Add to cart</button>
                    <button className="btn btn-ghost" onClick={() => handleRemove(item._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="center" style={{marginTop:22}}>
            <button className="btn btn-ghost" onClick={handleClearWishlist}>Clear Wishlist</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;

