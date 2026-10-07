import React, { InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onClear, placeholder = 'Search...', ...props }, ref) => {
    const [internalVal, setInternalVal] = React.useState('');
    const currentVal = value !== undefined ? value : internalVal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalVal(e.target.value);
      onChange?.(e.target.value);
    };

    return (
      <div className={cn('relative w-full', className)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={ref}
          type="text"
          value={currentVal}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-10 text-sm text-[#1e293b] transition-colors duration-200 focus:outline-none focus:border-[#1a2f8a] focus:ring-2 focus:ring-[#1a2f8a]/20"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748b] hover:text-[#1e293b] focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
