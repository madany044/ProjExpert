import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext(null);

export const useConfirm = () => useContext(ConfirmContext);

const ConfirmProvider = ({ children }) => {
  const [modal, setModal] = useState({ open: false, title: '', message: '', resolve: null });

  const confirm = useCallback((message, title = 'Confirm') => {
    return new Promise((resolve) => {
      setModal({ open: true, title, message, resolve });
    });
  }, []);

  const handle = (ok) => {
    if (modal.resolve) modal.resolve(ok);
    setModal({ open: false, title: '', message: '', resolve: null });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full text-gray-900">
            <h3 className="text-lg font-semibold">{modal.title}</h3>
            <p className="mt-2 text-sm">{modal.message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => handle(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button onClick={() => handle(true)} className="px-3 py-1 rounded bg-red-600 text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
