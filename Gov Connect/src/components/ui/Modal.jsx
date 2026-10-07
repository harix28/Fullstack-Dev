import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
export const Modal = ({ isOpen, onClose, title, children, size = 'md', footer, }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!mounted || !isOpen)
        return null;
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };
    const modalContent = (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"/>
      <div className={cn('relative w-full bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 scale-100 opacity-100', sizeClasses[size])} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between p-4 border-b border-[#D6CCC2]">
          <h2 className="text-lg font-semibold text-[#2D231E]">{title}</h2>
          <button onClick={onClose} className="text-[#7D6E63] hover:text-[#2D231E] hover:bg-[#EDEDE9] rounded-lg p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#59463B]/40" aria-label="Close modal">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
        {footer && (<div className="p-4 border-t border-[#D6CCC2] bg-[#FAF7F2] rounded-b-xl">
            {footer}
          </div>)}
      </div>
    </div>);
    return createPortal(modalContent, document.body);
};
