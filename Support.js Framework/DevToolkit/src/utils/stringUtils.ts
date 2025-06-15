/**
 * String utility functions
 */

/**
 * Convert string to camelCase
 * @param str - The string to convert
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

/**
 * Convert string to kebab-case
 * @param str - The string to convert
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to snake_case
 * @param str - The string to convert
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate a string to a specified length
 * @param str - The string to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Remove extra whitespace from a string
 * @param str - The string to clean
 */
export function cleanWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Check if a string is a valid email
 * @param email - The email string to validate
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random string
 * @param length - Length of the string
 * @param charset - Character set to use (default: alphanumeric)
 */
export function randomString(length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Pluralize a word based on count
 * @param word - The word to pluralize
 * @param count - The count
 * @param pluralForm - Custom plural form (optional)
 */
export function pluralize(word: string, count: number, pluralForm?: string): string {
  if (count === 1) return word;
  if (pluralForm) return pluralForm;
  
  // Simple pluralization rules
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  }
  return word + 's';
}

/**
 * Escape HTML characters in a string
 * @param str - The string to escape
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
