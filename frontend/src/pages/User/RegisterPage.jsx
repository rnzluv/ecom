import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/Auth.css";
import { useToast } from '../../components/ToastProvider';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/register", formData);

            // FIRST API FORMAT:
            // { message, id, name, email, role }
            const { name, email } = res.data;

            if (!email) {
                throw new Error("Missing registration data from server");
            }

            toast.show("Registration successful!", { type: 'success' });

            // Redirect to login page
            navigate("/user/login");

        } catch (err) {
            toast.show(err.response?.data?.message || "Registration failed", { type: 'danger' });
        }
    };

    return (
        <div className="auth-container">

            <img className="auth-logo" src="/logo.png" alt="logo" />

            <h2>SIGN UP</h2>

            <div className="auth-box">

                <form onSubmit={handleSubmit}>
                    <label htmlFor="register-name" className="sr-only">Full Name</label>
                    <input
                        id="register-name"
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        aria-label="Full Name"
                    />

                    <label htmlFor="register-email" className="sr-only">Email Address</label>
                    <input
                        id="register-email"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                        aria-label="Email Address"
                    />

                    <label htmlFor="register-password" className="sr-only">Password</label>
                    <input
                        id="register-password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        aria-label="Password"
                    />

                    <label htmlFor="register-role" className="sr-only">Role</label>
                    <select
                        id="register-role"
                        name="role"
                        onChange={handleChange}
                        aria-label="Role"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit" className="auth-btn">
                        CREATE ACCOUNT
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <a href="/user/login">Log In</a>
                </div>
            </div>

        </div>
    );
};

export default RegisterPage;
