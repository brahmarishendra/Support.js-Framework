// Export all utility functions
export * as dateUtils from './dateUtils';
export * as stringUtils from './stringUtils';
export * as numberUtils from './numberUtils';

// Re-export individual functions for convenience
export {
  formatDate,
  getRelativeTime,
  addDays,
  isToday,
  startOfDay,
  endOfDay,
  isSameDay
} from './dateUtils';

export {
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  capitalize,
  truncate,
  cleanWhitespace,
  isValidEmail,
  randomString,
  pluralize,
  escapeHtml
} from './stringUtils';

export {
  formatCurrency,
  toPercentage,
  clamp,
  randomBetween,
  roundTo,
  formatNumber,
  formatBytes,
  inRange,
  average,
  sum,
  median
} from './numberUtils';
