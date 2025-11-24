import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../styles/dashboard.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalCustomers: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load products
      const productsRes = await axios.get("/api/products");
      const products = productsRes.data.products || productsRes.data || [];
      
      // Load orders (if endpoint exists)
      let orders = [];
      try {
        const ordersRes = await axios.get("/api/orders");
        orders = ordersRes.data || [];
      } catch (err) {
        console.log("Orders endpoint not available");
      }

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const lowStockProducts = products.filter(p => (p.stock || 0) < 5).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
        totalCustomers: 0 // Would come from users endpoint
      });

      // Set recent orders
      setRecentOrders(orders.slice(0, 5));

      // Calculate top products
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          const id = item.product?._id || item.product;
          productSales[id] = (productSales[id] || 0) + item.quantity;
        });
      });

      const top = products
        .map(p => ({
          ...p,
          soldCount: productSales[p._id] || 0
        }))
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 5);

      setTopProducts(top);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <p className="subtitle">Welcome back! Here's what's happening with your store.</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon products">
                <i className="fas fa-box"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orders">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-info">
                <h3>₱{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.lowStockProducts}</h3>
                <p>Low Stock Items</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon customers">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalCustomers}</h3>
                <p>Total Customers</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/admin/products/add" className="action-card">
                <i className="fas fa-plus-circle"></i>
                <span>Add New Product</span>
              </Link>
              <Link to="/admin/products" className="action-card">
                <i className="fas fa-boxes"></i>
                <span>Manage Inventory</span>
              </Link>
              <Link to="/admin/orders" className="action-card">
                <i className="fas fa-clipboard-list"></i>
                <span>View Orders</span>
              </Link>
              <Link to="/admin/products/history" className="action-card">
                <i className="fas fa-history"></i>
                <span>View History</span>
              </Link>
            </div>
          </div>

          {/* Recent Orders & Top Products */}
          <div className="dashboard-grid">
            {/* Recent Orders */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <Link to="/admin/orders" className="view-all">View All</Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <p className="empty-state">No orders yet</p>
              ) : (
                <div className="orders-list">
                  {recentOrders.map(order => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <p className="order-id">#{order._id.slice(-6)}</p>
                        <p className="order-customer">{order.customerName || 'Customer'}</p>
                      </div>
                      <div className="order-details">
                        <span className={`status-badge ${order.status}`}>
                          {order.status || 'pending'}
                        </span>
                        <p className="order-amount">₱{(order.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Top Products</h2>
                <Link to="/admin/products" className="view-all">View All</Link>
              </div>
              
              {topProducts.length === 0 ? (
                <p className="empty-state">No products yet</p>
              ) : (
                <div className="products-list">
                  {topProducts.map((product, index) => (
                    <div key={product._id} className="product-item">
                      <span className="rank">#{index + 1}</span>
                      <img 
                        src={product.image || '/placeholder.jpg'} 
                        alt={product.name}
                        className="product-thumb"
                      />
                      <div className="product-info">
                        <p className="product-name">{product.name}</p>
                        <p className="product-sales">{product.soldCount} sold</p>
                      </div>
                      <p className="product-price">₱{product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          {stats.lowStockProducts > 0 && (
            <div className="alert-section">
              <div className="alert warning">
                <i className="fas fa-exclamation-triangle"></i>
                <div>
                  <h3>Low Stock Alert</h3>
                  <p>{stats.lowStockProducts} product(s) are running low on stock. Please restock soon.</p>
                </div>
                <Link to="/admin/products" className="btn btn-sm">View Products</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}