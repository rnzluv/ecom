import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../components/ToastProvider';
import getFallbackImage from '../../utils/imageFallback';
import AuthPromptModal from '../../components/AuthPromptModal';
import '../../styles/product.css';
import ConfirmModal from '../../components/ConfirmModal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
        toast.show('Failed to load product', { type: 'danger' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post('/api/cart/add', { productId: product._id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      toast.show('Added to cart', { type: 'success' });
      navigate('/cart');
    } catch (err) {
      console.error('Add to cart error', err);
      toast.show('Failed to add to cart', { type: 'danger' });
    }
  };

  if (loading) return <div className="app-container"><p>Loading product...</p></div>;

  if (!product) return <div className="app-container"><p>Product not found.</p></div>;

  return (
    <div className="app-container product-page" style={{paddingTop:40}}>
      <div className="product-detail grid">
        <div className="product-media card">
          <img src={product.image || getFallbackImage(product.name)} alt={product.name} loading="lazy" />
        </div>

        <div className="product-info card">
          <h2>{product.name}</h2>
          <p className="muted">₱{(product.price || 0).toLocaleString()}</p>
          <p>{product.description}</p>

          <div style={{marginTop:16}}>
            <button className="btn btn-primary" onClick={addToCart}>Add to cart</button>
            <button className="btn btn-ghost" style={{marginLeft:8}} onClick={() => navigate('/shop')}>Back to shop</button>
          </div>
        </div>
      </div>

      <AuthPromptModal show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
