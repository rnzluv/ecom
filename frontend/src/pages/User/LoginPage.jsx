import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import "../../styles/Auth.css";
import { useToast } from '../../components/ToastProvider';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", formData);

            // Get response data
            const { token, name, email, role } = res.data;

            if (!token || !email) {
                throw new Error("Missing login data from server");
            }

            // Save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ name, email, role }));

            // Show success toast
            toast.show("Welcome back!", { type: 'success' });

            // Navigate based on user role or default to home
            // Change these routes to match YOUR App.js routes!
            const redirect = localStorage.getItem('redirectAfterLogin');
            if (role === "admin") {
                navigate("/admin/dashboard"); // Admin dashboard
            } else {
                // For regular users - UPDATE THIS PATH!
                // Options:
                // navigate("/shop");     // Go to shop page
                // navigate("/home");     // Go to home page  
                // navigate("/dashboard"); // Go to dashboard
                // window.location.href = "/"; // Force full page reload
                
                                // Prefer a stored redirect, otherwise go to /home
                                if (redirect) {
                                    localStorage.removeItem('redirectAfterLogin');
                                    navigate(redirect);
                                } else {
                                    navigate("/home");
                                }
            }

        } catch (err) {
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.message || "Login failed";
            setError(errorMessage);
            toast.show(errorMessage, { type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-section">
                <img className="auth-logo" src="/logo.png" alt="logo" />
                <h1 className="brand-name">AUREVRA</h1>
                <p className="brand-subtitle">JEWELRY</p>
            </div>

            <div className="auth-box">
                <div className="auth-header">
                    <div className="header-accent"></div>
                    <h2>LOGIN</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-message error">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        value={formData.email}
                        required
                        disabled={loading}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                        disabled={loading}
                    />

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember Me</span>
                        </label>

                        <Link to="/user/forgot-password" className="forgot-password-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "LOGGING IN..." : "LOG IN"}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an Account?</span>
                    <Link to="/user/register">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;