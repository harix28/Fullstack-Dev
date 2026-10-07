import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { createPortal } from 'react-dom';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((options) => {
        const id = Math.random().toString(36).substring(7);
        const duration = options.duration ?? 4000;
        const newToast = { ...options, id, duration, variant: options.variant ?? 'info' };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
    }, []);
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };
    return (<ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== 'undefined' && createPortal(<div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (<ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)}/>))}
        </div>, document.body)}
    </ToastContext.Provider>);
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
const ToastItem = ({ toast, onRemove }) => {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-600"/>,
        error: <XCircle className="w-5 h-5 text-red-600"/>,
        warning: <AlertTriangle className="w-5 h-5 text-amber-600"/>,
        info: <Info className="w-5 h-5 text-[#59463B]"/>,
    };
    return (<div className="pointer-events-auto bg-white border border-[#D6CCC2] rounded-xl shadow-lg p-4 min-w-[300px] max-w-sm flex items-start gap-3 animate-in slide-in-from-right-full fade-in duration-300">
      <div className="shrink-0 mt-0.5">{icons[toast.variant || 'info']}</div>
      <div className="flex-1 mr-4">
        <h4 className="text-sm font-medium text-[#2D231E]">{toast.title}</h4>
        {toast.description && (<p className="text-sm text-[#7D6E63] mt-1">{toast.description}</p>)}
      </div>
      <button onClick={onRemove} className="shrink-0 text-[#7D6E63] hover:text-[#2D231E] focus:outline-none">
        <X className="w-4 h-4"/>
      </button>
    </div>);
};
