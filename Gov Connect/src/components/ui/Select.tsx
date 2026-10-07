import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, options, placeholder, id, ...props },
    ref
  ) => {
    const selectId = id || Math.random().toString(36).substring(7);

    return (
      <div className={cn('flex flex-col', className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[#1e293b] mb-1 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-lg border px-3 py-2 pr-10 text-sm text-[#1e293b] bg-white transition-colors duration-200 focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 ring-red-500/20 focus:border-red-500'
                : 'border-[#e2e8f0] focus:border-[#1a2f8a] focus:ring-[#1a2f8a]/20'
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
