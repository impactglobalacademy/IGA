'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {label}
            {props.required && <span className="text-error-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 text-base border-2 rounded-lg transition-all duration-fast',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500',
              'placeholder:text-slate-400',
              error
                ? 'border-error-300 bg-error-50 focus:ring-error-500'
                : 'border-slate-200 bg-white hover:border-slate-300',
              icon && 'pl-10',
              className,
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm font-medium text-error-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-600">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
