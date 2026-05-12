import { cn } from '../../lib/utils';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">{children}</table>
      </div>
    </div>
  );
}

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-white/[0.02]', className)}>
      {children}
    </thead>
  );
}

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-white/5', className)}>
      {children}
    </tbody>
  );
}

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function TableRow({ children, className, hover = true }: TableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors duration-150',
        hover && 'hover:bg-white/[0.02]',
        className
      )}
    >
      {children}
    </tr>
  );
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'header';
}

export function TableCell({ children, className, variant = 'default' }: TableCellProps) {
  const Component = variant === 'header' ? 'th' : 'td';
  return (
    <Component
      className={cn(
        'px-4 py-3 text-left text-sm',
        variant === 'header'
          ? 'font-semibold text-gray-300 uppercase tracking-wider text-xs'
          : 'text-gray-300',
        className
      )}
    >
      {children}
    </Component>
  );
}
