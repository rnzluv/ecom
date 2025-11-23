import React, { useEffect } from 'react';
import '../styles/toast.css';

export default function Toast({ id, type = 'info', message, onClose, duration = 3500 }) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onClose && onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={() => onClose && onClose(id)} aria-label="Close">×</button>
    </div>
  );
}
