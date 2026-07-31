import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(function Button({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}, ref) {
  const variants = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground text-foreground',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;