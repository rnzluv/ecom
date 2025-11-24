// Cleaned and fixed App.js with proper structure and routing
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider.jsx";

// User Pages
import LoginPage from "./pages/User/LoginPage.jsx";
import LandingPage from "./pages/User/LandingPage.jsx";
import RegisterPage from "./pages/User/RegisterPage.jsx";
import HomePage from "./pages/User/HomePage.jsx";
import ForgotPasswordPage from "./pages/User/ForgotPassword.jsx";
import ShopPage from "./pages/User/shop.jsx";
import Cart from "./pages/User/cart.jsx";
import Checkout from "./pages/User/checkout.jsx";
import Success from "./pages/User/success.jsx";
import Wishlist from "./pages/User/Wishlist.jsx";
import AboutUs from "./pages/User/aboutus.jsx";
import ProductDetail from "./pages/User/ProductDetail.jsx";

// Admin Pages
import AddProductPage from "./pages/Admin/AddProductPage.jsx";
import DashboardPage from "./pages/Admin/DashboardPage.jsx";
import ProductHistory from "./pages/Admin/ProductHistory.jsx";
import ProductsPage from "./pages/Admin/ProductsPage.jsx";

// Layouts
import UserLayout from "./components/UserLayout.jsx";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/register" element={<RegisterPage />} />
          <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />

          {/* User Routes */}
          <Route
            path="/home"
            element={
              <UserRoute>
                <UserLayout>
                  <HomePage />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/shop"
            element={
              <UserRoute>
                <UserLayout>
                  <ShopPage />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <UserRoute>
                <UserLayout>
                  <Cart />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <UserRoute>
                <UserLayout>
                  <Checkout />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/success"
            element={
              <UserRoute>
                <UserLayout>
                  <Success />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <UserRoute>
                <UserLayout>
                  <Wishlist />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/about"
            element={
              <UserRoute>
                <UserLayout>
                  <AboutUs />
                </UserLayout>
              </UserRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <UserRoute>
                <UserLayout>
                  <ProductDetail />
                </UserLayout>
              </UserRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/add"
            element={
              <AdminRoute>
                <AddProductPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/history"
            element={
              <AdminRoute>
                <ProductHistory />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

// Helper to read user from localStorage safely
function getUser() {
  try {
    const data = JSON.parse(localStorage.getItem("user"));
    return data || null;
  } catch {
    return null;
  }
}

// Protect User Routes
function UserRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
}

// Protect Admin Routes
function AdminRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role !== "admin") return <Navigate to="/home" replace />;
  return children;
}

export default App;