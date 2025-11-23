import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../components/ToastProvider';

export default function Success() {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    toast.show('Order placed successfully', { type: 'success' });
    const timer = setTimeout(() => navigate("/home"), 5000);
    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="container mt-5 pt-5 text-center mb-5">
      <div className="py-5">
        <i
          className="fas fa-check-circle"
          style={{ fontSize: "70px", color: "green", marginBottom: "20px" }}
        />
        <h2 className="fw-bold mt-3">Thank You for Your Order!</h2>
        <p className="text-muted mt-3">
          Your order has been successfully placed. We'll send you a confirmation email shortly.
        </p>
        <p className="text-muted mb-4">You will be redirected to the home page in 5 seconds...</p>

        <button className="btn btn-dark me-2" onClick={() => navigate("/home")}>Return to Home</button>
        <button className="btn btn-outline-dark" onClick={() => navigate("/shop")}>Continue Shopping</button>
      </div>
    </div>
  );
}
