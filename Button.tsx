'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-fast rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
      primary:
        'bg-primary-950 text-white hover:bg-primary-900 focus:ring-primary-500',
      secondary:
        'bg-secondary-950 text-white hover:bg-secondary-900 focus:ring-secondary-500',
      outline:
        'border-2 border-primary-950 text-primary-950 hover:bg-primary-50 focus:ring-primary-500',
      ghost:
        'text-primary-950 hover:bg-primary-50 focus:ring-primary-500',
      danger:
        'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
      success:
        'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    };

    const sizes = {
      xs: 'px-2 py-1.5 text-xs gap-1.5',
      sm: 'px-3 py-2 text-sm gap-2',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-lg gap-3',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <div className="inline-flex items-center">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          </div>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
