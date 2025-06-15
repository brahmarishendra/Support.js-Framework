// Main entry point - exports all core utilities and types
export * from './core';
export * from './types';

// Re-export commonly used utilities for convenience
export {
  formatDate,
  addDays,
  isToday,
  getAge
} from './core/date';

export {
  capitalize,
  camelCase,
  kebabCase,
  truncate
} from './core/string';

export {
  unique,
  groupBy,
  flatten,
  chunk,
  intersection
} from './core/array';

export {
  deepClone,
  merge,
  pick,
  omit,
  deepEqual
} from './core/object';

export {
  isEmail,
  isPhone,
  isURL,
  isCreditCard
} from './core/validation';

export {
  formatCurrency,
  formatPercentage,
  roundTo
} from './core/number';

export {
  debounce,
  throttle,
  memoize
} from './core/performance';

export {
  Logger,
  createLogger
} from './core/logger';
