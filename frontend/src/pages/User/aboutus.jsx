import React from 'react';
import "../../styles/about.css";

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="container py-5">
        {/* Hero Section */}
        <section className="hero-about text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">About Aurevra Jewelry</h1>
          <p className="lead text-muted">
            Crafting timeless elegance since 2020
          </p>
        </section>

        {/* Our Story */}
        <section className="about-section mb-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold mb-3">Our Story & Craft</h2>
              <p className="text-muted">
                Our story began with a simple dedication: to move beyond fleeting trends and create 
                jewelry with enduring significance. This commitment is woven into every design. We honor 
                the meticulous process of master craftsmanship, utilizing expert hands and premium materials 
                to ensure that each piece not only beautifully reflects the unique spirit of the wearer, 
                but is also built to be cherished for generations.
              </p>
              <p className="text-muted">
                At Aurevra Jewelry, we believe that every piece tells a story. Our collections are designed 
                to celebrate the moments that matter most - from everyday elegance to life's most special occasions.
              </p>
            </div>
            <div className="col-md-6 text-center">
              <div className="placeholder-image" style={{
                backgroundColor: "#e9ecef",
                height: "300px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#6c757d"
              }}>
                [Jewelry Crafting Image]
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mission-section mb-5">
          <h2 className="fw-bold text-center mb-4">Our Mission</h2>
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-gem" style={{ fontSize: "40px", color: "#caa54e", marginBottom: "15px" }}></i>
              <h5 className="fw-bold">Premium Quality</h5>
              <p className="text-muted">
                We source the finest materials to create jewelry that lasts a lifetime
              </p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-hands" style={{ fontSize: "40px", color: "#caa54e", marginBottom: "15px" }}></i>
              <h5 className="fw-bold">Craftsmanship</h5>
              <p className="text-muted">
                Each piece is meticulously crafted by our expert artisans with passion and precision
              </p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-heart" style={{ fontSize: "40px", color: "#caa54e", marginBottom: "15px" }}></i>
              <h5 className="fw-bold">Customer Care</h5>
              <p className="text-muted">
                Your satisfaction and happiness is our top priority
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section text-center py-5">
          <h2 className="fw-bold mb-3">Get In Touch</h2>
          <p className="text-muted mb-4">Have questions? We'd love to hear from you!</p>
          <p className="mb-2">
            <i className="fas fa-envelope me-2"></i>
            <strong>aurevrajewelry@gmail.com</strong>
          </p>
          <p className="mb-4">
            <i className="fas fa-phone me-2"></i>
            <strong>09123456789</strong>
          </p>
          <button className="btn btn-dark mt-3">Contact Us</button>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;