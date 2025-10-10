import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl bg-white dark:bg-secondary-900 transition-all duration-200';
    
    const variants = {
      default: 'border border-secondary-200 dark:border-secondary-800 shadow-soft',
      elevated: 'shadow-medium hover:shadow-strong',
      outlined: 'border-2 border-secondary-200 dark:border-secondary-700',
    };
    
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          paddings[padding],
          hover && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-strong',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
