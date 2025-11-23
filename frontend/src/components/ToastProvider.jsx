import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type: opts.type || 'info', duration: opts.duration ?? 3500 };
    setToasts((t) => [...t, toast]);
    return id;
  }, []);

  const close = useCallback((id) => {
    setToasts((t) => t.filter(x => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, close }}>
      {children}
      <div className="toast-viewport">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={close} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
