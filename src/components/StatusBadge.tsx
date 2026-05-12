import { Badge } from './ui/Badge';

interface StatusBadgeProps {
  status: 'synced' | 'processing' | 'failed' | 'live' | 'draft' | 'published';
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string }> = {
  synced: { variant: 'success', label: 'SYNCED' },
  processing: { variant: 'warning', label: 'PROCESSING' },
  failed: { variant: 'danger', label: 'FAILED' },
  live: { variant: 'success', label: 'LIVE' },
  draft: { variant: 'neutral', label: 'DRAFT' },
  published: { variant: 'info', label: 'PUBLISHED' },
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
