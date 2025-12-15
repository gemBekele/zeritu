import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the full image URL, handling both absolute URLs and relative paths
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    // Fallback to a generic placeholder from Unsplash
    return 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Remove duplicate /uploads if present
  const cleanPath = normalizedPath.replace(/^\/uploads\/uploads/, '/uploads');
  
  return `${apiUrl}${cleanPath}`;
}
