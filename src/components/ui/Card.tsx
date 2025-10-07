import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl bg-white transition-all duration-200';
    
    const variants = {
      default: 'border border-secondary-200 shadow-soft',
      elevated: 'shadow-medium hover:shadow-strong',
      outlined: 'border-2 border-secondary-200',
    };
    
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    const Component = hover ? motion.div : 'div';
    const motionProps = hover ? {
      whileHover: { y: -2, shadow: 'strong' },
      transition: { duration: 0.2 }
    } : {};

    return (
      <Component
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          paddings[padding],
          hover && 'cursor-pointer',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;
