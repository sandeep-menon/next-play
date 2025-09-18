import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageURL(url: string | null | undefined, size: string = "t_original"): string | null {
  if (!url) return null;
  
  return "https:" + url.replace(/t_[^/]+/, size);
}