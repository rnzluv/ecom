import React from "react";
import UserNavbar from "./userNavBar";
import Footer from "./footer";
import "../styles/UserLayout.css";

export default function UserLayout({ children }) {
  return (
    <div className="user-layout-wrapper">
      <UserNavbar />
      <main className="user-layout-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
