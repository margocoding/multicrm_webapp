import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'synced' | 'processing' | 'failed' | 'live' | 'draft' | 'published';
  size?: 'sm' | 'md';
}

const statusConfig = {
  synced: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'SYNCED' },
  processing: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'PROCESSING' },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'FAILED' },
  live: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'LIVE' },
  draft: { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'DRAFT' },
  published: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', label: 'PUBLISHED' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 ${config.bg} ${config.border} border rounded-full px-2.5 py-0.5 ${size === 'sm' ? 'text-xs' : 'text-xs font-medium'} ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.color} bg-current animate-pulse-glow`}></span>
      {config.label}
    </motion.span>
  );
}
