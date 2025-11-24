// Full rewritten Checkout component with working validation, dark mode compatibility,
// fixed missing fields, and stable order submission.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../components/ToastProvider";
import getFallbackImage from "../../utils/imageFallback";
import "../../styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod"
  });

  // ------------------------------------------------------
  // LOAD ITEMS + PREFILL USER DATA
  // ------------------------------------------------------
  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/user/login");
      return;
    }

    const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    if (checkoutItems.length === 0) {
      toast.show("No items selected for checkout", { type: "error" });
      navigate("/cart");
      return;
    }
    setItems(checkoutItems);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((p) => ({
        ...p,
        fullName: user.name || "",
        email: user.email || ""
      }));
    }
  }, [token, navigate, toast]);

  // ------------------------------------------------------
  // HANDLE INPUTS
  // ------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------------------------------
  // SUBMIT ORDER
  // ------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.show("Please fill in all required fields", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateTotal(),
        customerEmail: formData.email
      };

      await axios.post("/api/orders/create", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Promise.all(
        items.map((item) =>
          axios.delete("/api/cart/remove", {
            data: { productId: item.product._id },
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      localStorage.removeItem("checkoutItems");

      toast.show("Order placed successfully!", { type: "success" });
      navigate("/success");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.show(err.response?.data?.message || "Failed to place order", {
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------
  // TOTALS
  // ------------------------------------------------------
  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const calculateShipping = () => 0;

  const calculateTotal = () => calculateSubtotal() + calculateShipping();

  // ------------------------------------------------------
  // VIEW
  // ------------------------------------------------------
  return (
    <div className="checkout-page-wrapper">
      <div className="app-container">
        <h2 className="page-title">Checkout</h2>

        <div className="checkout-layout">
          {/* LEFT FORM */}
          <div className="shipping-form-container card">
            <h3 className="section-title">Shipping Information</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "error" : ""}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? "error" : ""}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={errors.postalCode ? "error" : ""}
                  />
                  {errors.postalCode && (
                    <span className="error-text">{errors.postalCode}</span>
                  )}
                </div>
              </div>

              {/* PAYMENT */}
              <h3 className="section-title mt-4">Payment Method</h3>

              <div className="payment-methods">
                {[
                  { id: "cod", icon: "fas fa-money-bill-wave", label: "Cash on Delivery" },
                  { id: "gcash", icon: "fas fa-mobile-alt", label: "GCash" },
                  { id: "card", icon: "fas fa-credit-card", label: "Credit/Debit Card" }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`payment-option ${
                      formData.paymentMethod === pm.id ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={formData.paymentMethod === pm.id}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <i className={pm.icon}></i>
                      <span>{pm.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-place-order"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* RIGHT SUMMARY */}
          <aside className="order-summary-sidebar card">
            <h3 className="summary-header">Order Summary</h3>

            <div className="item-list">
              {items.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <div className="item-img-container">
                    <img
                      src={item.product.image || getFallbackImage(item.product.name)}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="item-details">
                    <p className="item-name">{item.product.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-subtotal">
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-footer">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₱{calculateSubtotal().toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span className="free">FREE</span>
              </div>

              <div className="total-row">
                <span>Total:</span>
                <span>₱{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
