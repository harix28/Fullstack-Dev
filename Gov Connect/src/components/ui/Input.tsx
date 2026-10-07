import React, { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, leftIcon, rightIcon, id, ...props },
    ref
  ) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className={cn('flex flex-col', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#1e293b] mb-1 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-lg border px-3 py-2 text-sm text-[#1e293b] bg-white transition-colors duration-200 focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 ring-red-500/20 focus:border-red-500'
                : 'border-[#e2e8f0] focus:border-[#1a2f8a] focus:ring-[#1a2f8a]/20',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : ''
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
        {hint && !error && (
          <span className="text-[#64748b] text-xs mt-1">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
