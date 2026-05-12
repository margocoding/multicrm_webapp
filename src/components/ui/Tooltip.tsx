import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-[#0F172A] border border-white/10 rounded-lg shadow-xl',
              'whitespace-nowrap backdrop-blur-sm',
              positionClasses[position]
            )}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-[#0F172A] border-r border-b border-white/10 rotate-45',
                position === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r-0 border-t-0 border-l border-b',
                position === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 border-l-0 border-b-0 border-r border-t',
                position === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-l-0 border-r border-b',
                position === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 border-b-0 border-r-0 border-l border-t'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
