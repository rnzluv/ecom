import React from "react";
import Navbar from "../../components/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Welcome admin! Here is your overview.</p>
      </div>
    </>
  );
}
