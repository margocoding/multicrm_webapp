import type { HTMLProps, ReactNode } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps
  extends Omit<HTMLProps<HTMLSelectElement>, 'onChange' | 'value' | 'multiple'> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  multiple?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  leftIcon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      options,
      disabled,
      multiple = false,
      value,
      onChange,
      name,
      required,
      id,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Закрытие dropdown при клике вне
    useEffect(() => {
      if (!multiple) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [multiple]);

    // Нормализуем value в массив для multiple-режима
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
    const selectedLabels = options
      .filter((o) => selectedValues.includes(o.value))
      .map((o) => o.label);

    const displayText =
      selectedLabels.length === 0
        ? ''
        : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `Выбрано: ${selectedLabels.length}`;

    const handleToggleOption = (optValue: string) => {
      if (!onChange) return;
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optValue)
        ? current.filter((v) => v !== optValue)
        : [...current, optValue];
      onChange(next);
    };

    const handleSingleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const baseClasses = cn(
      'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-100 text-sm',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50',
      'hover:border-white/20',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/[0.02]',
      error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
      leftIcon && 'pl-10',
      className
    );

    // ИСПРАВЛЕНО: используем inset-y-0 flex items-center вместо top-1/2
    const chevron = (
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );

    // ИСПРАВЛЕНО: аналогичная фиксация для левой иконки
    const leftIconNode = leftIcon ? (
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
        {leftIcon}
      </div>
    ) : null;

    if (!multiple) {
      return (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
          )}
          <div className="relative">
            {leftIconNode}
            <select
              id={id}
              name={name}
              required={required}
              className={cn(baseClasses, 'appearance-none cursor-pointer pr-10')}
              ref={ref}
              disabled={disabled}
              value={(value as string) ?? ''}
              onChange={handleSingleChange}
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
            {chevron}
          </div>
          {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        </div>
      );
    }

    // ---------- MULTIPLE MODE ----------
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
        )}
        <div className="relative" ref={containerRef}>
          {leftIconNode}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen((v) => !v)}
            disabled={disabled}
            id={id}
            // ИСПРАВЛЕНО: добавлен класс 'relative', чтобы absolute позиционирование работало внутри кнопки
            className={cn(
              baseClasses,
              'relative flex items-center justify-between text-left cursor-pointer pr-10'
            )}
          >
            <span className={cn('truncate', selectedLabels.length === 0 && 'text-gray-500')}>
              {displayText || 'Выберите...'}
            </span>
            
            {/* ИСПРАВЛЕНО: используем inset-y-0 flex items-center */}
            <div
              className={cn(
                'absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 transition-transform',
                isOpen && 'rotate-180'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Скрытый нативный select для совместимости с ref / react-hook-form */}
          <select
            ref={ref}
            name={name}
            required={required}
            multiple
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            value={selectedValues}
            onChange={() => {}}
          />

          {isOpen && (
            <div className="absolute z-20 mt-1 w-full bg-[#0B1120] border border-white/10 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">Нет доступных опций</div>
              ) : (
                options.map((opt) => {
                  const checked = selectedValues.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                        'hover:bg-white/5',
                        checked && 'bg-red-500/5'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleOption(opt.value)}
                        className="w-4 h-4 rounded border-gray-600 bg-transparent text-red-500 focus:ring-red-500/50"
                      />
                      <span className="text-sm text-gray-100 truncate">{opt.label}</span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };