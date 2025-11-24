import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from '../../components/ToastProvider';
import ConfirmModal from '../../components/ConfirmModal';
import getFallbackImage from '../../utils/imageFallback';
import '../../styles/cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const token = localStorage.getItem("token");

  // Function to notify navbar to refresh cart count
  const refreshNavbarCart = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/user/login");
      return;
    }
    fetchCart();
  }, [token, navigate]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      refreshNavbarCart(); // Notify navbar to update
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart({ items: [] });
      refreshNavbarCart(); // Update even on error
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put("/api/cart/update",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      toast.show('Quantity updated', { type: 'info' });
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.show('Failed to update quantity', { type: 'error' });
    }
  };

  const removeItem = (productId) => {
    setConfirmMessage('Remove this item from your cart?');
    setConfirmAction(() => async () => {
      try {
        await axios.delete("/api/cart/remove", {
          data: { productId },
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchCart();
        setSelectedItems(prev => prev.filter(id => id !== productId));
        toast.show('Item removed', { type: 'info' });
      } catch (err) {
        console.error("Failed to remove item:", err);
        toast.show('Failed to remove item', { type: 'error' });
      }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const removeSelected = () => {
    if (selectedItems.length === 0) {
      toast.show('Please select items to remove', { type: 'error' });
      return;
    }

    setConfirmMessage(`Remove ${selectedItems.length} selected item(s)?`);
    setConfirmAction(() => async () => {
      try {
        await Promise.all(
          selectedItems.map(productId =>
            axios.delete("/api/cart/remove", {
              data: { productId },
              headers: { Authorization: `Bearer ${token}` }
            })
          )
        );
        await fetchCart();
        setSelectedItems([]);
        toast.show('Selected items removed', { type: 'info' });
      } catch (err) {
        console.error("Failed to remove items:", err);
        toast.show('Failed to remove items', { type: 'error' });
      }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const clearCart = () => {
    setConfirmMessage('Clear your entire cart? This cannot be undone.');
    setConfirmAction(() => async () => {
      try {
        await axios.delete("/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchCart();
        setSelectedItems([]);
        toast.show('Cart cleared', { type: 'info' });
      } catch (err) {
        console.error("Failed to clear cart:", err);
        toast.show('Failed to clear cart', { type: 'error' });
      }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart?.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart?.items.map(item => item.product._id) || []);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.show('Please select items to checkout', { type: 'error' });
      return;
    }
    // Store selected items for checkout
    const checkoutItems = cart.items.filter(item => 
      selectedItems.includes(item.product._id)
    );
    localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="app-container" style={{paddingTop:60}}>
        <h2 className="fw-bold mb-4">Your Cart</h2>
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const selectedTotal = items
    .filter(item => selectedItems.includes(item.product?._id))
    .reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="app-container">
        <div className="cart-header">
          <h2 className="fw-bold mb-4">
            <i className="fas fa-shopping-cart"></i> Your Cart
          </h2>
          {items.length > 0 && (
            <div className="cart-header-actions">
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={toggleSelectAll}
                />
                <span>Select All ({items.length})</span>
              </label>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart empty-icon"></i>
            <h4>Your cart is currently empty</h4>
            <p>Looks like you haven't made your choice yet, bestie.</p>
            <button className="btn btn-primary" onClick={() => navigate("/shop")}>
              START SHOPPING
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              {items.map((item) => (
                <div key={item.product?._id} className="cart-item-card">
                  <input
                    type="checkbox"
                    className="item-checkbox"
                    checked={selectedItems.includes(item.product?._id)}
                    onChange={() => toggleSelectItem(item.product?._id)}
                  />
                  
                  <div className="item-image">
                    <img 
                      src={item.product?.image || getFallbackImage(item.product?.name)} 
                      alt={item.product?.name} 
                      loading="lazy" 
                    />
                  </div>

                  <div className="item-details">
                    <h5 className="item-name">{item.product?.name}</h5>
                    <p className="item-price">₱{(item.product?.price || 0).toLocaleString()}</p>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      <button 
                        className="btn-remove"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  </div>

                  <div className="item-subtotal">
                    ₱{((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <h5 className="summary-title">Order Summary</h5>
                
                <div className="summary-row">
                  <span>Items ({selectedItems.length})</span>
                  <span>₱{selectedTotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">FREE</span>
                </div>

                <hr />

                <div className="summary-total">
                  <span>Total</span>
                  <span className="total-amount">₱{selectedTotal.toLocaleString()}</span>
                </div>

                <button 
                  className="btn btn-primary btn-checkout"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                >
                  Proceed to Checkout ({selectedItems.length})
                </button>

                <div className="summary-actions">
                  <button className="btn btn-ghost btn-sm" onClick={removeSelected}>
                    Delete Selected
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        <ConfirmModal
          open={confirmOpen}
          title="Confirm Action"
          message={confirmMessage}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => { if (confirmAction) confirmAction(); }}
        />
      </div>
    </div>
  );
}