// src/components/AdminLayout.jsx
import React from "react";
// import Sidebar from "./Sidebar"; // your sidebar component
// import Topbar from "./Topbar";   // optional, if you have a topbar

export default function AdminLayout({ children }) {
  return (
    <div className="admin-page">
      <div className="admin-root">
        {/* <Sidebar /> */}
        <main className="admin-main">
          {/* <Topbar /> optional */}
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
