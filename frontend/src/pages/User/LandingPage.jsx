import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/home.css';
import getFallbackImage from '../../utils/imageFallback';
import Footer from '../../components/footer.jsx';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/products');
        const list = res.data.products || [];
        setFeatured(Array.isArray(list) ? list.slice(0, 4) : []);
      } catch (err) {
        console.error('Failed to load featured products', err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="landing-page" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <header className="landing-hero">
        <div className="hero-inner app-container">
          <div className="hero-left">
            <img src="/logo.png" alt="Aurevra" className="landing-logo" />
            <h1>Timeless Jewelry, Modern Minimalism</h1>
            <p className="muted">Handcrafted pieces for everyday elegance. Shop curated designs made to last.</p>
            <div style={{marginTop:18}}>
              <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
              <Link to="/user/register" className="btn btn-ghost" style={{marginLeft:8}}>Create Account</Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="card">
              <div className="card-media">
                <img src={getFallbackImage('banner')} alt="Spotlight" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="featured-section">
        <h2>Featured</h2>
        {loading ? (
          <p>Loading...</p>
        ) : featured.length === 0 ? (
          <p>No featured items yet.</p>
        ) : (
          <div className="featured-list">
            {featured.map(p => (
              <div key={p._id} className="featured-card">
                <img src={p.image || getFallbackImage(p.name)} alt={p.name} loading="lazy" />
                <h3>{p.name}</h3>
                <div className="price">₱{(p.price || 0).toLocaleString()}</div>
                <Link to={`/product/${p._id}`} className="btn btn-ghost" style={{marginTop:'auto', width:'100%'}}>View</Link>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
