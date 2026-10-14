import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// A middle dot that stays with the text before it, so a line never starts
// with "·".
export const SEPARATOR = '\u00a0· ';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
