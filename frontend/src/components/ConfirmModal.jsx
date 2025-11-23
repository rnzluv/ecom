import React from 'react';
import '../styles/modal.css';

export default function ConfirmModal({ open, title = 'Confirm', message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
