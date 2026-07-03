import React from 'react';
import { cn } from '../../utils/cn';
import { InputProps } from './types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-slate-500 dark:text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border transition-all duration-300 capitalize",
              "px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-brand-dark",
              "bg-white dark:bg-white/5", // Light: white bg, Dark: subtle glass
              "text-slate-900 dark:text-white", // Text color
              "border-slate-200 dark:border-white/10", // Default border
              "hover:border-slate-300 dark:hover:border-white/20", // Hover state
              {
                "pl-10": !!icon,
                "border-red-500 dark:border-red-500 focus:ring-red-500": !!error,
                "focus:ring-brand-green focus:border-brand-green dark:focus:border-brand-green": !error,
                "opacity-50 cursor-not-allowed": props.disabled,
              },
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 dark:text-red-400 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
