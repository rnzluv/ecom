// src/pages/Admin/ProductsPage.js
import React, { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";
import "../../components/Admin.css";
import Navbar from "../../components/Navbar";
import { useToast } from "../../components/ToastProvider";
import ConfirmModal from "../../components/ConfirmModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [search, category, page]);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await API.get("/products", {
        params: { search, category, page, limit: 20 },
      });

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.show("Failed to load products", { type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  function requestDelete(id) {
    setToDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    setConfirmOpen(false);
    if (!toDeleteId) return;
    try {
      await API.delete(`/products/${toDeleteId}`);
      toast.show("Product deleted!", { type: 'success' });
      setToDeleteId(null);
      loadProducts();
    } catch (err) {
      toast.show(err.response?.data?.message || "Delete failed", { type: 'danger' });
    }
  }

  return (
    <>
      <Navbar />

      <section className="card panel">
        {/* HEADER */}
        <div className="panel-header">
          <h2>Product Inventory</h2>
        </div>

        {/* FILTERS */}
        <div className="panel-body filter-row">
          <input
            className="search-input"
            placeholder="Search product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            className="search-input"
            placeholder="Filter by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Link to="/admin/products/add" className="btn-primary">
            + Add Product
          </Link>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${p.image}`}
                        alt={p.name}
                        className="thumb-img"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{p.name}</td>
                  <td>{p.category || "-"}</td>
                  <td>₱{p.price.toLocaleString("en-PH")}</td>
                  <td>{p.stock}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>

                  <td className="actions-col">
                    <Link
                      to={`/admin/products/edit/${p._id}`}
                      className="btn-small"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn-small btn-danger"
                      onClick={() => requestDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
        <ConfirmModal
          open={confirmOpen}
          title="Delete product"
          message="Are you sure you want to delete this product? This cannot be undone."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      </section>
    </>
  );
}
