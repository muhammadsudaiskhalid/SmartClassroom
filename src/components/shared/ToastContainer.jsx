import React, { useState, useCallback, createContext, useContext } from 'react';
import Toast from './Toast';

// Create a context for toast notifications
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ marginTop: index > 0 ? '8px' : '0' }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Export a simple function for backward compatibility
let toastFunction = null;

export const setToastFunction = (fn) => {
  toastFunction = fn;
};

export const showToast = (message, type = 'info', duration = 3000) => {
  if (toastFunction) {
    toastFunction(message, type, duration);
  } else {
    console.warn('Toast system not initialized');
  }
};

// Default export component
const ToastContainer = () => {
  const { addToast } = useToast();

  React.useEffect(() => {
    setToastFunction(addToast);
    return () => {
      setToastFunction(null);
    };
  }, [addToast]);

  return null;
};

export default ToastContainer;