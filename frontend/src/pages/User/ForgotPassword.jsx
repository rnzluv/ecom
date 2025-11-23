import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ForgotPassword.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link has been sent to your email!');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Logo */}
        <div className="logo-section">
          <img src="/logo.png" alt="Aurevra Logo" className="auth-logo" />
          <h1 className="brand-name">AUREVRA</h1>
          <p className="brand-subtitle">JEWELRY</p>
        </div>

        {/* Forgot Password Form */}
        <div className="forgot-password-card">
          <div className="card-header">
            <div className="header-accent"></div>
            <h2>FORGOT PASSWORD</h2>
          </div>

          <div className="card-body">
            <p className="instruction-text">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {message && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
            </form>

            <div className="back-to-login">
              <Link to="/user/login" className="link-text">
                <i className="fas fa-arrow-left"></i> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}