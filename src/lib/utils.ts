import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the correct asset URL for public folder assets
 * Handles base URL correctly for GitHub Pages deployment
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // BASE_URL already includes trailing slash (e.g., '/yeepschristmas/')
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
