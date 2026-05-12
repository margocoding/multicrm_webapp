import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/5 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4',
        variant === 'rectangular' && 'h-24',
        className
      )}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            i === lines - 1 ? 'w-3/4' : 'w-full',
            i === 0 && 'h-5',
            i > 0 && 'h-4'
          )}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('p-4 space-y-4', className)}>
      <Skeleton variant="rectangular" className="w-full h-32 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    </div>
  );
}
