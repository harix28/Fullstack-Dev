import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'new' | 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    new: 'bg-[#ccfbf1] text-[#0f766e]',
    primary: 'bg-[#e0eaff] text-[#1a2f8a]',
    secondary: 'bg-[#ccfbf1] text-[#0d9488]',
    outline: 'border border-[#cbd5e1] text-[#475569] bg-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
