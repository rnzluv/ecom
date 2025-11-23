import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from '../../components/ToastProvider';
import Skeleton from '../../components/Skeleton';
import getFallbackImage from '../../utils/imageFallback';

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "cod"
  });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toast = useToast();

  useEffect(() => {
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/user/login');
      return;
    }

    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create purchase record
      await axios.post(
        "/api/history/purchases/add/purchase",
        {
          items: cart?.items || [],
          totalAmount: cart?.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0,
          paymentMethod: formData.paymentMethod,
          shippingAddress: formData.address,
          customerEmail: formData.email,
          customerName: formData.fullName,
          customerPhone: formData.phone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart
      await axios.delete("/api/cart/clear", { headers: { Authorization: `Bearer ${token}` } });

      toast && toast.show('Order placed — thank you!', { type: 'success' });
      navigate('/success');
    } catch (err) {
      console.error("Checkout error:", err);
      toast && toast.show('Failed to place order', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const total = cart?.items?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;

  return (
    <div className="app-container" style={{paddingTop:40}}>
      <h2 className="fw-bold mb-4">Checkout</h2>

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:20}}>
        <div>
          <div className="card" style={{padding:18}}>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gap:12}}>
                <label>Full Name
                  <input name="fullName" value={formData.fullName} onChange={handleChange} required className="form-control" />
                </label>

                <label>Email
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
                </label>

                <label>Phone
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-control" />
                </label>

                <label>Shipping Address
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} required className="form-control" />
                </label>

                <label>Payment Method
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="form-select">
                    <option value="cod">Cash on Delivery</option>
                    <option value="gcash">GCash</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </label>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <aside>
          <div className="card" style={{padding:16}}>
            <h5 className="fw-bold mb-3">Order Summary</h5>
            {cart?.items?.length === 0 ? (
              <p className="muted">Cart is empty</p>
            ) : (
              <div style={{display:'grid',gap:10}}>
                {cart.items.map(item => (
                  <div key={item.product?._id} style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{width:60,height:60,overflow:'hidden',borderRadius:8}}>
                      <img src={(item.product && (item.product.image || item.product.photo)) ? (item.product.image || item.product.photo) : getFallbackImage(item.product?.name)} alt={item.product?.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy" />
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600}}>{item.product?.name}</div>
                      <div className="muted">Qty: {item.quantity}</div>
                    </div>
                    <div>₱{((item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                  </div>
                ))}

                <hr />
                <div style={{display:'flex',justifyContent:'space-between',fontWeight:700}}> <span>Total:</span> <span>₱{total.toLocaleString()}</span></div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
