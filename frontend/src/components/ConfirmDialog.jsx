import React from 'react';

const ConfirmDialog = ({ title = 'Confirm', message, onConfirm, onCancel }) => {
  // simple confirm modal using native confirm as fallback
  const handle = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm(message || 'Are you sure?')) onConfirm(); else onCancel && onCancel();
    } else {
      onConfirm();
    }
  };

  return (
    <div>
      {/* This component is intentionally minimal; we call window.confirm where used for simplicity */}
      <button onClick={handle} className="hidden">confirm</button>
    </div>
  );
};

export default ConfirmDialog;
