import { cn } from '../../lib/utils';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-auto', // Разрешаем вертикальный скролл
        'max-h-[calc(100vh-240px)]', // Ограничиваем высоту, чтобы хедер был виден
        className,
      )}
    >
      {/* border-separate обязателен для работы sticky header */}
      <table className="w-full border-separate border-spacing-0">
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        // Sticky header: прилипает к верху при скролле
        'sticky top-0 z-10',
        // Фон должен быть непрозрачным, иначе контент просвечивает при скролле
        // Используем цвет фона страницы (примерно #0F172A для темной темы)
        'bg-[#0F172A]',
        // Тень снизу для визуального отделения
        'shadow-[0_1px_0_0_rgba(255,255,255,0.05)]',
        className,
      )}
    >
      {children}
    </thead>
  );
}

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  // Убрали divide-y, так как теперь границы на TableRow
  return <tbody className={cn(className)}>{children}</tbody>;
}

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function TableRow({
  children,
  className,
  hover = true,
  onClick,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors duration-150',
        hover && 'hover:bg-white/2',
        'border-b border-white/5',
        'last:border-b-0',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'header';
  colSpan?: number;
  rowSpan?: number;
}

export function TableCell({
  children,
  className,
  variant = 'default',
  colSpan,
  rowSpan,
}: TableCellProps) {
  const Component = variant === 'header' ? 'th' : 'td';
  return (
    <Component
      className={cn(
        'px-4 py-3 text-left text-sm align-middle',
        variant === 'header'
          ? 'font-semibold text-gray-300 uppercase tracking-wider text-xs'
          : 'text-gray-300',
        className,
      )}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </Component>
  );
}