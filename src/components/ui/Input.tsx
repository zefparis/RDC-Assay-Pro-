import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 rounded-xl border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-secondary-900 placeholder-secondary-400 dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder-secondary-500';
    
    const stateClasses = error 
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200 dark:border-danger-700 dark:focus:ring-danger-800'
      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-200 dark:border-secondary-700 dark:focus:ring-primary-900';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              baseClasses,
              stateClasses,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
