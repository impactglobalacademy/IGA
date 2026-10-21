'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(({ size = 'md', variant = 'primary', className, ...props }, ref) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const colors = {
    primary: 'border-primary-500 border-r-transparent',
    secondary: 'border-secondary-500 border-r-transparent',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-block animate-spin rounded-full',
        sizes[size],
        colors[variant],
        className,
      )}
      {...props}
    />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = 'Loading...' }: LoadingPageProps) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <LoadingSpinner size="lg" />
    <p className="text-slate-600 text-lg">{message}</p>
  </div>
);

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ count = 1, className, ...props }, ref) => (
    <div className={cn('space-y-4', className)} ref={ref} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  ),
);

Skeleton.displayName = 'Skeleton';

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard = ({ count = 3 }: SkeletonCardProps) => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg mb-4 animate-pulse" />
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded mb-3 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded mb-2 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-2/3 animate-pulse" />
      </div>
    ))}
  </div>
);
