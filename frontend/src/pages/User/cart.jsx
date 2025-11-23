import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from '../../components/ToastProvider';
import ConfirmModal from '../../components/ConfirmModal';
import getFallbackImage from '../../utils/imageFallback';

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Check if logged in and fetch cart
  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/user/login");
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put(
        "/api/cart/update",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      toast && toast.show('Cart updated', { type: 'info' });
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast && toast.show('Failed to update cart', { type: 'error' });
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    // Open confirm modal instead of immediately deleting
    setConfirmOpen(true);
    setPendingRemove(productId);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);

  const doRemoveConfirmed = async () => {
    if (!pendingRemove) return;
    try {
      await axios.delete(
        "/api/cart/remove",
        {
          data: { productId: pendingRemove },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPendingRemove(null);
      setConfirmOpen(false);
      fetchCart();
      toast && toast.show('Removed from cart', { type: 'info' });
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast && toast.show('Failed to remove item', { type: 'error' });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="app-container" style={{paddingTop:60}}>
        <h2 className="fw-bold mb-4">Your Cart</h2>
        <div className="products-grid">
          <div className="card"><div style={{height:120}}></div></div>
          <div className="card"><div style={{height:120}}></div></div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="app-container" style={{paddingTop:40}}>
      <h2 className="fw-bold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <div className="text-center mt-5">
          <h4>Your cart is empty.</h4>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/shop") }>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:22}}>
          <div>
            {items.map((item) => (
              <div key={item.product?._id} className="product-card card" style={{display:'flex',gap:12,alignItems:'center',padding:12,marginBottom:12}}>
                <div style={{width:120,height:120,overflow:'hidden',borderRadius:8}}>
                  <img src={(item.product && (item.product.image || item.product.photo)) ? (item.product.image || item.product.photo) : getFallbackImage(item.product?.name)} alt={item.product?.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy" />
                </div>
                <div style={{flex:1}}>
                  <h5 style={{margin:0}}>{item.product?.name}</h5>
                  <p className="muted">₱{(item.product?.price || 0).toLocaleString()}</p>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
                    <button className="btn btn-ghost" onClick={() => updateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <div>{item.quantity}</div>
                    <button className="btn btn-ghost" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                    <button className="btn btn-ghost" onClick={() => removeItem(item.product._id)} style={{marginLeft:12}}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside>
            <div className="card" style={{padding:18}}>
              <h5 className="fw-bold">Order Summary</h5>
              <hr />
              <p className="d-flex justify-content-between muted">
                <span>Subtotal:</span>
                <span>₱{total.toLocaleString()}</span>
              </p>
              <p className="d-flex justify-content-between muted">
                <span>Shipping:</span>
                <span>Free</span>
              </p>
              <hr />
              <p className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>₱{total.toLocaleString()}</span>
              </p>

              <button className="btn btn-primary w-100 mt-3" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      )}
      <ConfirmModal
        open={confirmOpen}
        title="Remove item"
        message="Remove this item from your cart?"
        onCancel={() => { setConfirmOpen(false); setPendingRemove(null); }}
        onConfirm={doRemoveConfirmed}
      />
    </div>
  );
}
