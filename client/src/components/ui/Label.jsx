import { cn } from '@/lib/utils';

function Label({ className, children, ...props }) {
  return (
    <label
      className={cn('text-sm font-medium leading-none mb-1.5 block', className)}
      {...props}
    >
      {children}
    </label>
  );
}

export default Label;