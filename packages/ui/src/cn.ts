/**
 * className merge helper (shadcn convention).
 * Moved here so every app shares the same tailwind-merge behaviour.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
