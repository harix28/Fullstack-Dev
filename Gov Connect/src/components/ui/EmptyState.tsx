import React, { ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  } | ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-8', className)}>
      {icon && (
        <div className="bg-gray-100 rounded-full p-4 mb-4 text-gray-500 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{title}</h3>
      <p className="text-[#64748b] text-sm max-w-md mb-6">{description}</p>
      {action && (
        React.isValidElement(action) ? (
          action
        ) : typeof action === 'object' && 'label' in action && 'onClick' in action ? (
          <Button variant="primary" onClick={(action as any).onClick}>
            {(action as any).label}
          </Button>
        ) : null
      )}
    </div>
  );
};
