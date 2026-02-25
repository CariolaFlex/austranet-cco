import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: unknown): string {
  if (!date) return '-';
  try {
    let d: Date;
    if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'string') {
      d = new Date(date);
    } else if (typeof date === 'object' && date !== null && 'seconds' in date) {
      d = new Date((date as { seconds: number }).seconds * 1000);
    } else {
      return '-';
    }
    if (isNaN(d.getTime())) {
      return '-';
    }
    return format(d, 'dd/MM/yyyy', { locale: es });
  } catch {
    return '-';
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
