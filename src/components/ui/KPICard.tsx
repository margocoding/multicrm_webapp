import { motion } from 'framer-motion';
import { Card } from './Card';

export interface KPICardProps {
  title: string;
  value: number | string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function KPICard({ title, value, change, trend = 'neutral', icon }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover glow className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white tracking-tight"
            >
              {value}
            </motion.p>
          </div>
          {icon && (
            <div className="p-3 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-xl text-red-400 ring-1 ring-red-500/20">
              {icon}
            </div>
          )}
        </div>
        
        {change && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'
          }`}>
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${
              trend === 'up' ? 'bg-emerald-500/20' : trend === 'down' ? 'bg-red-500/20' : 'bg-gray-500/20'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
            {change}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
