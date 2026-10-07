import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, asChild = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#59463B]/40 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
        primary: 'bg-[#59463B] text-white hover:bg-[#2D231E]',
        secondary: 'bg-[#A67C65] text-white hover:bg-[#8C644F]',
        outline: 'border-2 border-[#59463B] text-[#59463B] hover:bg-[#FAF7F2]',
        ghost: 'text-[#7D6E63] hover:bg-[#EDEDE9] hover:text-[#2D231E]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };
    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: cn(combinedClassName, children.props.className),
            ...props,
        });
    }
    return (<button ref={ref} disabled={disabled || isLoading} className={combinedClassName} {...props}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin"/>}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>);
});
Button.displayName = 'Button';
