import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <img src="/ui/footer.png" className="footer-bg" />

      <div className="footer-content">
        <div className="footer-column">
          <img src="/ui/logo.png" className="footer-logo" />
          <h2 className="brand-title">AUREVRA</h2>
          <p className="brand-sub">JEWELRY</p>
        </div>

        <div className="footer-column">
          <h3>CONTACT US</h3>
          <hr />
          <p>Email: aurevrajewelry@gmail.com</p>
          <p>Phone: 09123456789</p>
        </div>

        <div className="footer-column">
          <h3>ABOUT US</h3>
          <hr />
          <p>
            Aurevra Jewelry is a timeless collection celebrating individuality
            and craftsmanship.
          </p>
        </div>

        <div className="footer-column">
          <h3>DEVELOPERS</h3>
          <hr />
          <p>Queenie Ruth Legaspi</p>
          <p>Josh Lenard Oliveros</p>
          <p>April Mae Agustin</p>
          <p>Vince Vuzty Nabong</p>
        </div>

        <div className="footer-column">
          <h3>ADDRESS</h3>
          <hr />
          <p>Bulacan State University, Hagonoy Bulacan</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Aurevra Jewelry. All Rights Reserved.
      </div>
    </footer>
  );
}
