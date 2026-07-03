import React from 'react';
import { cn } from '../../utils/cn';
import { ButtonProps } from './types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          {
            // Primary: Neon Green with glow in both modes
            "bg-brand-green text-brand-dark hover:brightness-110 shadow-[0_0_15px_rgba(184,255,26,0.4)] hover:shadow-[0_0_20px_rgba(184,255,26,0.6)] focus:ring-brand-green dark:focus:ring-offset-brand-dark": variant === 'primary',
            // Secondary: Glassy dark in dark mode, light glass/white in light mode
            "bg-white/10 dark:bg-brand-card-dark text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/20 focus:ring-slate-400": variant === 'secondary',
            // Ghost: Transparent with hover
            "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 focus:ring-slate-400": variant === 'ghost',
            // Icon: specific padding and rounded-full for circular buttons if needed
            "p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 focus:ring-slate-400 rounded-full": variant === 'icon',
            
            // Sizes (only apply if not icon)
            "px-3 py-1.5 text-sm": size === 'sm' && variant !== 'icon',
            "px-5 py-2.5 text-base": size === 'md' && variant !== 'icon',
            "px-6 py-3 text-lg": size === 'lg' && variant !== 'icon',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
