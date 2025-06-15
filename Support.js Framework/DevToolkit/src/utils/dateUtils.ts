/**
 * Date utility functions
 */

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
}

/**
 * Format a date using a simple format string
 * @param date - The date to format
 * @param format - Format string (YYYY, MM, DD, HH, mm, ss)
 * @param options - Additional formatting options
 */
export function formatDate(date: Date, format: string, options?: DateFormatOptions): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to compare
 * @param baseDate - The base date to compare against (defaults to now)
 */
export function getRelativeTime(date: Date, baseDate: Date = new Date()): string {
  const diffMs = baseDate.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) {
    return 'just now';
  } else if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0 ? `${diffMinutes} minutes ago` : `in ${Math.abs(diffMinutes)} minutes`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `${diffHours} hours ago` : `in ${Math.abs(diffHours)} hours`;
  } else {
    return diffDays > 0 ? `${diffDays} days ago` : `in ${Math.abs(diffDays)} days`;
  }
}

/**
 * Add days to a date
 * @param date - The base date
 * @param days - Number of days to add (can be negative)
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if a date is today
 * @param date - The date to check
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

/**
 * Get the start of day for a given date
 * @param date - The date
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of day for a given date
 * @param date - The date
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}
