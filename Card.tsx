'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-fast',
        hover &&
          'hover:shadow-lg hover:border-slate-300 hover:scale-105',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-slate-200', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<
  HTMLDivElement,
  CardContentProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-slate-200 bg-slate-50', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';
