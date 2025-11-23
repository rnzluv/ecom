// src/pages/PurchaseHistory.js
import React, { useEffect, useState } from "react";
import API from "../../api.js";
import Navbar from "../../components/Navbar";
import { useToast } from "../../components/ToastProvider";

export default function PurchaseHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await API.get("/purchase-history");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      toast.show("Failed to load purchase history", { type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <section className="card panel">
          <h2>Purchase History</h2>
          <p>Loading...</p>
        </section>
      </>
    );
  }

  // Empty state
  if (logs.length === 0) {
    return (
      <>
        <Navbar />
        <section className="card panel">
          <h2>Purchase History</h2>
          <p>No purchases found.</p>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="card panel">
        <h2>Purchase History</h2>

        <table className="history-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.user?.email || "Unknown"}</td>
                <td>{log.product?.name || "—"}</td>
                <td>{log.quantity || 1}</td>
                <td>₱{log.total?.toFixed(2) || "0.00"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
