import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, width, height }) => {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      style={{ width, height }}
    />
  );
};

export const SkeletonText: React.FC<SkeletonProps> = ({ className, width = '100%', height = '1rem' }) => {
  return <Skeleton className={className} width={width} height={height} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm', className)}>
      <SkeletonText width="60%" height="1.5rem" className="mb-4" />
      <SkeletonText width="100%" className="mb-2" />
      <SkeletonText width="80%" className="mb-6" />
      <SkeletonText width="40%" height="2rem" />
    </div>
  );
};

export const SkeletonList: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6', className)}>
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'list' | 'text';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  type = 'card',
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        type === 'card' ? <SkeletonCard key={i} className={className} /> :
        type === 'list' ? <SkeletonList key={i} className={className} /> :
        <SkeletonText key={i} className={className} />
      ))}
    </div>
  );
};

