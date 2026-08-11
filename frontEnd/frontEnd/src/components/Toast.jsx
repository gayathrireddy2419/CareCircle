// src/components/Toast.jsx
import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle className="toast-icon success" size={20} />,
    error: <AlertCircle className="toast-icon error" size={20} />,
    info: <Info className="toast-icon info" size={20} />
  };

  return (
    <div className={`toast-container toast-${type}`}>
      {icons[type]}
      <span className="toast-message">{message}</span>
      {onClose && (
        <button onClick={onClose} className="toast-close">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
