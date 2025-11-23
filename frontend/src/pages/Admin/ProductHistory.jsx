// src/pages/ProductHistory.js
import React, { useEffect, useState } from "react";
import API from "../../api.js";
import Navbar from "../../components/Navbar";
import "../../styles/AdminNavbar.css";
import { useToast } from "../../components/ToastProvider";
export default function ProductHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await API.get("/product-history");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      toast.show("Failed to load product history", { type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="card panel">
          <h2>Product History</h2>
          <p>Loading history...</p>
        </section>
      </>
    );
  }

  if (logs.length === 0) {
    return (
      <>
        <Navbar />
        <section className="card panel">
          <h2>Product History</h2>
          <p>No product history found.</p>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="card panel">
        <h2>Product History</h2>

        <table className="history-table">
  <thead>
    <tr>
      <th>Image</th>
      <th>Admin</th>
      <th>Product</th>
      <th>Action</th>
      <th>Description</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {logs.map((log) => (
      <tr key={log._id}>
        <td>
          {log.productId?.image ? (
            <img
              src={log.productId.image}
              alt={log.productName}
              className="history-img"
            />
          ) : (
            "No Image"
          )}
        </td>

        <td>{log.admin || log.adminId?.email || "Unknown"}</td>
        <td>{log.productName || log.productId?.name || "—"}</td>
        <td>{log.action || "—"}</td>
        <td>{log.details || log.description || "—"}</td>
        <td>{new Date(log.createdAt || log.date).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>

      </section>
    </>
  );
}
