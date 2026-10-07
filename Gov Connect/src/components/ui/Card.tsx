import React, { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, children, hover = false, padding = 'md', onClick, ...props },
    ref
  ) => {
    const baseStyles = 'bg-white rounded-xl border border-[#e2e8f0] shadow-sm';
    
    const hoverStyles = hover
      ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
      : '';

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(baseStyles, hoverStyles, paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
