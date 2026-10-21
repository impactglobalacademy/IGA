'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  closeable?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      message,
      onClose,
      closeable = false,
      className,
      ...props
    },
    ref,
  ) => {
    const variants = {
      info: {
        container: 'bg-info-50 border-info-200 text-info-900',
        icon: <Info className="w-5 h-5" />,
        titleClass: 'text-info-900',
        messageClass: 'text-info-800',
      },
      success: {
        container: 'bg-success-50 border-success-200 text-success-900',
        icon: <CheckCircle className="w-5 h-5" />,
        titleClass: 'text-success-900',
        messageClass: 'text-success-800',
      },
      warning: {
        container: 'bg-warning-50 border-warning-200 text-warning-900',
        icon: <AlertTriangle className="w-5 h-5" />,
        titleClass: 'text-warning-900',
        messageClass: 'text-warning-800',
      },
      error: {
        container: 'bg-error-50 border-error-200 text-error-900',
        icon: <AlertCircle className="w-5 h-5" />,
        titleClass: 'text-error-900',
        messageClass: 'text-error-800',
      },
    };

    const variant = variants[type];

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-4 p-4 rounded-lg border-2',
          variant.container,
          className,
        )}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">{variant.icon}</div>
        <div className="flex-1">
          {title && (
            <h3 className={cn('font-semibold mb-1', variant.titleClass)}>
              {title}
            </h3>
          )}
          <p className={variant.messageClass}>{message}</p>
        </div>
        {closeable && (
          <button
            onClick={onClose}
            className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity"
            aria-label="Close alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';

export default Alert;
