/**
 * Angular pipes for support-js-framework
 */

import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, DateFormat } from '../../core/date';
import { formatCurrency, CurrencyOptions, formatPercentage } from '../../core/number';
import { capitalize, truncate, camelCase, kebabCase } from '../../core/string';
import { formatBytes } from '../../core/number';

/**
 * Date formatting pipe
 */
@Pipe({
  name: 'supportDate',
  pure: true
})
export class SupportDatePipe implements PipeTransform {
  transform(value: Date | string | number, format: DateFormat = 'MMM DD, YYYY'): string {
    if (!value) return '';
    
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    
    return formatDate(date, format);
  }
}

/**
 * Currency formatting pipe
 */
@Pipe({
  name: 'supportCurrency',
  pure: true
})
export class SupportCurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currency = 'USD',
    locale = 'en-US',
    options?: Partial<CurrencyOptions>
  ): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    
    return formatCurrency(value, {
      currency,
      locale,
      ...options
    });
  }
}

/**
 * Percentage formatting pipe
 */
@Pipe({
  name: 'supportPercentage',
  pure: true
})
export class SupportPercentagePipe implements PipeTransform {
  transform(value: number, decimals = 2, locale = 'en-US'): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    
    return formatPercentage(value, decimals, locale);
  }
}

/**
 * String truncation pipe
 */
@Pipe({
  name: 'supportTruncate',
  pure: true
})
export class SupportTruncatePipe implements PipeTransform {
  transform(value: string, length: number, suffix = '...'): string {
    if (!value) return '';
    
    return truncate(value, length, suffix);
  }
}

/**
 * String capitalization pipe
 */
@Pipe({
  name: 'supportCapitalize',
  pure: true
})
export class SupportCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    return capitalize(value);
  }
}

/**
 * camelCase conversion pipe
 */
@Pipe({
  name: 'supportCamelCase',
  pure: true
})
export class SupportCamelCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    return camelCase(value);
  }
}

/**
 * kebab-case conversion pipe
 */
@Pipe({
  name: 'supportKebabCase',
  pure: true
})
export class SupportKebabCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    return kebabCase(value);
  }
}

/**
 * File size formatting pipe
 */
@Pipe({
  name: 'supportFileSize',
  pure: true
})
export class SupportFileSizePipe implements PipeTransform {
  transform(value: number, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    
    return formatBytes(value, decimals);
  }
}

/**
 * Array join pipe
 */
@Pipe({
  name: 'supportJoin',
  pure: true
})
export class SupportJoinPipe implements PipeTransform {
  transform(value: any[], separator = ', '): string {
    if (!Array.isArray(value)) return '';
    
    return value.join(separator);
  }
}

/**
 * Safe HTML pipe (removes dangerous content)
 */
@Pipe({
  name: 'supportSafeHtml',
  pure: true
})
export class SupportSafeHtmlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Basic HTML sanitization - remove script tags and event handlers
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }
}

/**
 * Time ago pipe
 */
@Pipe({
  name: 'supportTimeAgo',
  pure: true
})
export class SupportTimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';
    
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Search/filter pipe
 */
@Pipe({
  name: 'supportFilter',
  pure: true
})
export class SupportFilterPipe implements PipeTransform {
  transform(
    items: any[],
    searchText: string,
    searchKey?: string
  ): any[] {
    if (!items || !searchText) {
      return items || [];
    }
    
    const searchLower = searchText.toLowerCase();
    
    return items.filter(item => {
      if (searchKey) {
        const value = item[searchKey];
        return value && value.toString().toLowerCase().includes(searchLower);
      } else {
        return JSON.stringify(item).toLowerCase().includes(searchLower);
      }
    });
  }
}

/**
 * Sort pipe
 */
@Pipe({
  name: 'supportSort',
  pure: true
})
export class SupportSortPipe implements PipeTransform {
  transform(
    items: any[],
    sortKey: string,
    direction: 'asc' | 'desc' = 'asc'
  ): any[] {
    if (!items || !sortKey) {
      return items || [];
    }
    
    return [...items].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (aValue === bValue) return 0;
      
      let result = 0;
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;
      
      return direction === 'desc' ? -result : result;
    });
  }
}

/**
 * Default value pipe
 */
@Pipe({
  name: 'supportDefault',
  pure: true
})
export class SupportDefaultPipe implements PipeTransform {
  transform(value: any, defaultValue: any = 'N/A'): any {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  }
}

/**
 * Highlight search text pipe
 */
@Pipe({
  name: 'supportHighlight',
  pure: true
})
export class SupportHighlightPipe implements PipeTransform {
  transform(
    text: string,
    search: string,
    highlightClass = 'highlight'
  ): string {
    if (!text || !search) return text || '';
    
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
  }
}
