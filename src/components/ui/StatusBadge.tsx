import { Badge } from './Badge';

export type StatusType = 'synced' | 'processing' | 'failed' | 'live' | 'draft' | 'published';

export interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string }> = {
  synced: { variant: 'success', label: 'Синхронизировано' },
  processing: { variant: 'warning', label: 'Обработка' },
  failed: { variant: 'danger', label: 'Ошибка' },
  live: { variant: 'success', label: 'Активен' },
  draft: { variant: 'neutral', label: 'Черновик' },
  published: { variant: 'info', label: 'Опубликовано' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size={size} glow>
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {config.label}
      </span>
    </Badge>
  );
}
