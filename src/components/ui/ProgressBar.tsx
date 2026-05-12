import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'danger';
  showValue?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantStyles = {
  default: 'from-red-600 to-red-700',
  success: 'from-emerald-600 to-emerald-700',
  danger: 'from-orange-600 to-orange-700',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative w-full bg-white/5 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-500 ease-out',
            variantStyles[variant],
            'shadow-[0_0_10px_rgba(220,38,38,0.5)]'
          )}
          style={{ width: `${percentage}%` }}
        />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-pulse" />
      </div>
      {showValue && (
        <div className="mt-1.5 text-xs text-gray-400 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
