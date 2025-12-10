import { DevLogPost, ProjectStatus } from '../models/devlog.model';

/**
 * DevLog Utility Functions
 * Helper functions for DevLog data manipulation and formatting
 */

/**
 * Calculate estimated reading time based on content length
 * Assumes average reading speed of 200 words per minute
 * @param content The markdown or HTML content
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  if (!content) {
    return 0;
  }

  // Remove markdown syntax and HTML tags for accurate word count
  const plainText = content
    .replace(/[#*_`[\]()]/g, '') // Remove markdown syntax
    .replace(/<[^>]*>/g, '')      // Remove HTML tags
    .replace(/\s+/g, ' ')         // Normalize whitespace
    .trim();

  const wordCount = plainText.split(' ').filter(word => word.length > 0).length;
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Format a date string into a human-readable format
 * @param dateString ISO date string
 * @param format Optional format type: 'short', 'medium', 'long'
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };

  return date.toLocaleDateString('en-US', formatOptions[format]);
}

/**
 * Sort posts by date in descending order (newest first)
 * @param posts Array of DevLog posts
 * @returns Sorted array of posts
 */
export function sortPostsByDate(posts: DevLogPost[]): DevLogPost[] {
  return [...posts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Sort posts by date in ascending order (oldest first)
 * @param posts Array of DevLog posts
 * @returns Sorted array of posts
 */
export function sortPostsByDateAsc(posts: DevLogPost[]): DevLogPost[] {
  return [...posts].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Filter posts by status (published or draft)
 * @param posts Array of DevLog posts
 * @param status Status to filter by
 * @returns Filtered array of posts
 */
export function filterPostsByStatus(posts: DevLogPost[], status: 'published' | 'draft'): DevLogPost[] {
  return posts.filter(post => post.status === status);
}

/**
 * Get unique tags from an array of posts
 * @param posts Array of DevLog posts
 * @returns Array of unique tags sorted alphabetically
 */
export function getUniqueTags(posts: DevLogPost[]): string[] {
  const tagsSet = new Set<string>();

  posts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Calculate project progress percentage based on dates
 * @param startDate Project start date
 * @param expectedEndDate Expected completion date
 * @param completionDate Actual completion date (optional)
 * @returns Progress percentage (0-100)
 */
export function calculateProjectProgress(
  startDate: string,
  expectedEndDate?: string,
  completionDate?: string
): number {
  const start = new Date(startDate).getTime();
  const now = new Date().getTime();

  // If project is completed, return 100%
  if (completionDate) {
    return 100;
  }

  // If no expected end date, can't calculate progress
  if (!expectedEndDate) {
    return 0;
  }

  const end = new Date(expectedEndDate).getTime();

  // If end date is in the past, return 100%
  if (now >= end) {
    return 100;
  }

  // Calculate percentage
  const totalDuration = end - start;
  const elapsed = now - start;
  const progress = (elapsed / totalDuration) * 100;

  return Math.max(0, Math.min(100, Math.round(progress)));
}

/**
 * Get a status badge color class for Tailwind CSS
 * @param status Project status
 * @returns Tailwind CSS color classes
 */
export function getStatusBadgeClass(status: ProjectStatus): string {
  const statusClasses: Record<ProjectStatus, string> = {
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'on-hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
}

/**
 * Get a human-readable status label
 * @param status Project status
 * @returns Formatted status label
 */
export function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'on-hold': 'On Hold'
  };

  return labels[status] || status;
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Generate a URL-friendly slug from a string
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Calculate days since a date
 * @param dateString ISO date string
 * @returns Number of days since the date
 */
export function daysSince(dateString: string): number {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = now - date;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days until a date
 * @param dateString ISO date string
 * @returns Number of days until the date (negative if past)
 */
export function daysUntil(dateString: string): number {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = date - now;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is in the past
 * @param dateString ISO date string
 * @returns True if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString).getTime() < new Date().getTime();
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 weeks")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const isPast = diffInSeconds > 0;
  const absDiff = Math.abs(diffInSeconds);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(absDiff / interval.seconds);
    if (count >= 1) {
      const plural = count > 1 ? 's' : '';
      return isPast
        ? `${count} ${interval.label}${plural} ago`
        : `in ${count} ${interval.label}${plural}`;
    }
  }

  return 'just now';
}
