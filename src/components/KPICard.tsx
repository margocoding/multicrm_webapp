import { motion } from 'framer-motion';

interface KPICardProps {
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
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass rounded-xl p-5 border border-white/5 hover:border-accent/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-white"
          >
            {value}
          </motion.p>
          {change && (
            <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-accent/10 rounded-lg text-accent">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
