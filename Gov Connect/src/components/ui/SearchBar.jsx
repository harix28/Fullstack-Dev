import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';
export const SearchBar = React.forwardRef(({ className, value, onChange, onClear, placeholder = 'Search...', ...props }, ref) => {
    const [internalVal, setInternalVal] = React.useState('');
    const currentVal = value !== undefined ? value : internalVal;
    const handleChange = (e) => {
        if (value === undefined)
            setInternalVal(e.target.value);
        onChange?.(e.target.value);
    };
    return (<div className={cn('relative w-full', className)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7D6E63]">
          <Search className="w-4 h-4"/>
        </div>
        <input ref={ref} type="text" value={currentVal} onChange={handleChange} placeholder={placeholder} className="w-full rounded-xl border border-[#D6CCC2] bg-white py-2.5 pl-10 pr-10 text-sm text-[#2D231E] transition-colors duration-200 focus:outline-none focus:border-[#59463B] focus:ring-2 focus:ring-[#59463B]/20" {...props}/>
        {value && onClear && (<button type="button" onClick={onClear} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7D6E63] hover:text-[#2D231E] focus:outline-none" aria-label="Clear search">
            <X className="w-4 h-4"/>
          </button>)}
      </div>);
});
SearchBar.displayName = 'SearchBar';
