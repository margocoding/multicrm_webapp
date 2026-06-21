import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type LoadingVariant = 'spinner' | 'overlay' | 'dots';
type LoadingSize = 'xs' | 'sm' | 'md' | 'lg';

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  text?: string;
  className?: string;
  fullHeight?: boolean;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Loading({
  variant = 'spinner',
  size = 'md',
  text,
  className,
  fullHeight,
}: LoadingProps) {
  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'absolute inset-0 z-10 flex flex-col items-center justify-center gap-3',
          'bg-background-dark/70 backdrop-blur-sm',
          fullHeight && 'min-h-75',
          className
        )}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className={cn(sizeMap[size], 'text-red-500')} />
        </motion.div>
        {text && (
          <p className={cn('text-gray-400', textSizeMap[size])}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={cn(
              'rounded-full bg-red-500',
              size === 'xs' && 'w-1 h-1',
              size === 'sm' && 'w-1.5 h-1.5',
              size === 'md' && 'w-2 h-2',
              size === 'lg' && 'w-3 h-3'
            )}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
        {text && (
          <span className={cn('ml-2 text-gray-400', textSizeMap[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={cn(sizeMap[size], 'text-red-500')} />
      </motion.div>
      {text && (
        <span className={cn('text-gray-400', textSizeMap[size])}>{text}</span>
      )}
    </div>
  );
}