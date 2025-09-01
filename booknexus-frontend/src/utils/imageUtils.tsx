import React from 'react';

/**
 * Formats an image URL by checking if it's absolute or relative
 * If relative, prepends the API base URL without the /api part
 */
export const formatImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/200x300?text=No+Cover'; // Default placeholder
  }
  
  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Get the base URL without /api
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');
  
  // Make sure imageUrl starts with a slash
  const imagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${baseUrl}${imagePath}`;
};

/**
 * Image component with built-in error handling and formatting
 */
export const BookCover: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}> = ({ src, alt, className, fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const defaultFallback = 'https://via.placeholder.com/200x300?text=No+Cover';
  
  return (
    <img
      src={!hasError ? formatImageUrl(src) : (fallback || defaultFallback)}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy" // Add lazy loading for better performance
    />
  );
};