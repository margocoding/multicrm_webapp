import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50',
            'hover:border-white/20',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/[0.02]',
            'resize-y min-h-[100px]',
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
