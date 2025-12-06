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

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), opacity 220ms',
              transform: t.show ? 'translateY(0)' : 'translateY(8px)',
              opacity: t.show ? 1 : 0
            }}
            className={`max-w-sm p-3 rounded shadow-lg ${t.type==='error'? 'bg-red-600' : 'bg-gray-900/80'}`}>
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
