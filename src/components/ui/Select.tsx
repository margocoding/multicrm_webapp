import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-100',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50',
              'hover:border-white/20',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/[0.02]',
              'appearance-none cursor-pointer',
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#0B1120] text-gray-100"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
