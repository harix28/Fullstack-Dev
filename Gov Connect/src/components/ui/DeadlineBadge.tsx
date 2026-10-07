import React from 'react';
import { Calendar } from 'lucide-react';
import { formatRelativeDate, isExpired } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

export interface DeadlineBadgeProps {
  deadline?: string;
  date?: string;
  label?: string;
  className?: string;
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline, date, label, className }) => {
  const targetDate = deadline || date || new Date().toISOString();
  const expired = isExpired(targetDate);
  
  const diffTime = new Date(targetDate).getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let colorClass = 'bg-green-50 text-green-600';
  if (expired || diffDays <= 7) {
    colorClass = 'bg-red-50 text-red-600';
  } else if (diffDays <= 30) {
    colorClass = 'bg-amber-50 text-amber-600';
  }

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', colorClass, className)}>
      <Calendar className="w-3.5 h-3.5" />
      {label && <span className="mr-1">{label}:</span>}
      {formatRelativeDate(targetDate)}
    </span>
  );
};
