import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const variantStyles = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  neutral: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const glowStyles = {
  success: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  warning: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  danger: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  info: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
  neutral: '',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  className,
  glow = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        variantStyles[variant],
        glow && glowStyles[variant],
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </span>
  );
}
