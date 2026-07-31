import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        // Explicit dark defaults to avoid invisible cards from theme variable mismatches
        'rounded-lg bg-zinc-900 text-white border border-white/10 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-4 text-white', className)} {...props}>
      {children}
    </div>
  );
}