import React from 'react';
import { useNavigate } from 'react-router-dom';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000
};

const boxStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '420px',
  width: '90%',
  boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
};

export default function AuthPromptModal({ show, onClose, message }) {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-3">Authentication required</h5>
        <p className="mb-3">{message || 'You need to be logged in to perform this action.'}</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-dark" onClick={() => navigate('/user/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}
