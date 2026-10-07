import React from 'react';
import { cn } from '@/utils/cn';
export const Card = React.forwardRef(({ className, children, hover = false, padding = 'md', onClick, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl border border-[#D6CCC2] shadow-sm';
    const hoverStyles = hover
        ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
        : '';
    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };
    return (<div ref={ref} onClick={onClick} className={cn(baseStyles, hoverStyles, paddings[padding], className)} {...props}>
        {children}
      </div>);
});
Card.displayName = 'Card';
