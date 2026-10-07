import React from 'react';
import { Target } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MatchBadgeProps {
  percentage?: number;
  matchPercentage?: number;
  className?: string;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ percentage, matchPercentage, className }) => {
  const value = percentage ?? matchPercentage ?? 0;
  let colorClass = 'bg-gray-100 text-gray-600';
  if (value >= 80) {
    colorClass = 'bg-green-100 text-green-700';
  } else if (value >= 60) {
    colorClass = 'bg-amber-100 text-amber-700';
  }

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', colorClass, className)}>
      <Target className="w-3.5 h-3.5" />
      {value}% Match
    </span>
  );
};
