import React from 'react';
import { cn } from '@/utils/cn';
export const Badge = ({ variant = 'default', size = 'md', children, className, }) => {
    const baseStyles = 'inline-flex items-center rounded-full font-medium';
    const variants = {
        default: 'bg-[#EDEDE9] text-[#43342B]',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-[#E3D5CA] text-[#59463B]',
        new: 'bg-[#E3D5CA] text-[#8C644F]',
        primary: 'bg-[#E3D5CA] text-[#59463B]',
        secondary: 'bg-[#E3D5CA] text-[#A67C65]',
        outline: 'border border-[#D6CCC2] text-[#59463B] bg-white',
    };
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };
    return (<span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>);
};
