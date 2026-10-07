import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
export const Select = React.forwardRef(({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substring(7);
    return (<div className={cn('flex flex-col', className)}>
        {label && (<label htmlFor={selectId} className="text-sm font-medium text-[#2D231E] mb-1 block">
            {label}
          </label>)}
        <div className="relative">
          <select id={selectId} ref={ref} className={cn('w-full appearance-none rounded-lg border px-3 py-2 pr-10 text-sm text-[#2D231E] bg-white transition-colors duration-200 focus:outline-none focus:ring-2', error
            ? 'border-red-500 ring-red-500/20 focus:border-red-500'
            : 'border-[#D6CCC2] focus:border-[#59463B] focus:ring-[#59463B]/20')} {...props}>
            {placeholder && (<option value="" disabled hidden>
                {placeholder}
              </option>)}
            {options.map((option) => (<option key={option.value} value={option.value}>
                {option.label}
              </option>))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7D6E63]">
            <ChevronDown className="w-4 h-4"/>
          </div>
        </div>
        {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
      </div>);
});
Select.displayName = 'Select';
