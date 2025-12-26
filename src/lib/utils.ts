import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Round to nearest 10 and format as currency without decimals or commas
export function roundToNearest10(amount: number): number {
  return Math.round(amount / 10) * 10;
}

export function formatCurrency(amount: number): string {
  const rounded = roundToNearest10(amount);
  return `R${rounded}`;
}
