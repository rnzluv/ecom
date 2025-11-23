import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastProvider } from './components/ToastProvider.jsx';
// USER PAGES
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
// ADMIN PAGES
import AddProductPage from "./pages/Admin/AddProductPage.jsx";
import DashboardPage from "./pages/Admin/DashboardPage.jsx";
import ProductHistory from "./pages/Admin/ProductHistory.jsx";
import ProductsPage from "./pages/Admin/ProductsPage.jsx";
import PurchaseHistory from "./pages/Admin/PurchaseHistory.jsx";
import UserCreatedHistory from "./pages/Admin/UserCreatedHistory.jsx";
// LAYOUTS
import UserLayout from "./components/UserLayout.jsx";
// ...existing code...

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
// Helper to read logged in user
function getUser() {
  try {
    const data = JSON.parse(localStorage.getItem("user"));
    return data || null;
  } catch {
    return null;
  }
}
// USER ROUTE PROTECTOR
function UserRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
// ADMIN ROUTE PROTECTOR
function AdminRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }
  return children;
}
// MAIN LAYOUT
function Layout() {
  return (
    <Routes>
      {/* PUBLIC LANDING */}
      <Route path="/" element={<LandingPage />} />
      {/* LOGIN / REGISTER */}
      {/* ...existing code... */}
    </Routes>
  );
}
// ...existing code...
