'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-primary-100 text-primary-700 border border-primary-300',
      secondary:
        'bg-secondary-100 text-secondary-700 border border-secondary-300',
      success:
        'bg-success-100 text-success-700 border border-success-300',
      warning:
        'bg-warning-100 text-warning-700 border border-warning-300',
      error:
        'bg-error-100 text-error-700 border border-error-300',
      info: 'bg-info-100 text-info-700 border border-info-300',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs font-medium',
      md: 'px-3 py-1.5 text-sm font-medium',
      lg: 'px-4 py-2 text-base font-medium',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
