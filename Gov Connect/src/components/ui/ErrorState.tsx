import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-8', className)}>
      <div className="bg-red-50 rounded-full p-4 mb-4 text-red-500 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{title}</h3>
      <p className="text-[#64748b] text-sm max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};
