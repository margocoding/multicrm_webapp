import { cn } from '../../lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'relative bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm',
        'transition-all duration-300',
        hover && 'hover:bg-white/[0.05] hover:border-white/20 hover:shadow-lg hover:shadow-black/20 cursor-pointer',
        glow && 'shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]',
        className
      )}
    >
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/[0.03] to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-white/10', className)}>
      {children}
    </div>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/10 bg-white/[0.02]', className)}>
      {children}
    </div>
  );
}
