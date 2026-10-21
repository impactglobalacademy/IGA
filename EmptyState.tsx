'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Package, Search, User, BookOpen } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: 'programmes' | 'search' | 'profile' | 'resources' | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const icons = {
  programmes: <Package className="w-16 h-16" />,
  search: <Search className="w-16 h-16" />,
  profile: <User className="w-16 h-16" />,
  resources: <BookOpen className="w-16 h-16" />,
};

const EmptyState = ({
  icon = 'programmes',
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  const iconElement =
    typeof icon === 'string' ? icons[icon as keyof typeof icons] : icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className,
      )}
    >
      <div className="text-slate-300 mb-4">{iconElement}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          {...(action.href && { as: 'a', href: action.href })}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
