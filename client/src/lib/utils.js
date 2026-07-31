import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes intelligently, resolving conflicts
 * (e.g. cn('p-2', condition && 'p-4') -> 'p-4' wins).
 * Used by every shadcn/ui-style component going forward.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}