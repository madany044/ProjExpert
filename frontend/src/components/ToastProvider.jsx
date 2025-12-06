import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type: opts.type || 'info', timeout: opts.timeout || 4000, show: false };
    setToasts(t => [...t, toast]);

    // small tick to allow CSS transition from hidden -> visible
    setTimeout(() => setToasts(t => t.map(x => (x.id === id ? { ...x, show: true } : x))), 20);

    if (toast.timeout > 0) {
      // hide first then remove to allow exit animation
      setTimeout(() => setToasts(t => t.map(x => (x.id === id ? { ...x, show: false } : x))), toast.timeout - 300);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), toast.timeout);
    }

    return id;
  }, []);

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  const getToastClasses = (type) => {
    const baseClasses = 'max-w-sm p-4 rounded-lg shadow-lg border text-gray-100 font-medium';
    switch(type) {
      case 'error':
        return `${baseClasses} bg-red-600 border-red-500`;
      case 'success':
        return `${baseClasses} bg-green-600 border-green-500`;
      case 'warning':
        return `${baseClasses} bg-amber-600 border-amber-500`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-600 border-blue-500`;
    }
  };

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-3 z-50 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), opacity 220ms',
              transform: t.show ? 'translateY(0)' : 'translateY(12px)',
              opacity: t.show ? 1 : 0,
              pointerEvents: t.show ? 'auto' : 'none'
            }}
            className={getToastClasses(t.type)}>
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
