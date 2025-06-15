/**
 * Next.js integration utilities with SSR support
 */

import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { formatDate } from '../../core/date';
import { Logger, createLogger } from '../../core/logger';
import { Storage } from '../../core/storage';

/**
 * SSR-safe storage utilities
 */
export class SSRStorage {
  /**
   * Check if we're running on the server
   */
  static isServer(): boolean {
    return typeof window === 'undefined';
  }

  /**
   * SSR-safe localStorage access
   */
  static getLocal<T>(key: string, defaultValue?: T): T | null {
    if (this.isServer()) return defaultValue || null;
    return Storage.get<T>(key) || defaultValue || null;
  }

  /**
   * SSR-safe localStorage set
   */
  static setLocal<T>(key: string, value: T): boolean {
    if (this.isServer()) return false;
    return Storage.set(key, value);
  }
}

/**
 * SEO-friendly date formatting for Next.js
 */
export function formatSEODate(date: Date): string {
  return formatDate(date, 'YYYY-MM-DD');
}

/**
 * Generate structured data for dates
 */
export function generateDateStructuredData(date: Date): object {
  return {
    '@type': 'Date',
    'dateTime': date.toISOString(),
    'datePublished': formatSEODate(date)
  };
}

/**
 * Next.js compatible logger that works in both SSR and client
 */
export function createNextLogger(prefix?: string): Logger {
  return createLogger({
    prefix: prefix ? `Next.js:${prefix}` : 'Next.js',
    enableConsole: true,
    enableStorage: !SSRStorage.isServer(),
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
  });
}

/**
 * Extract and validate query parameters
 */
export function getQueryParam(
  context: GetServerSidePropsContext | GetStaticPropsContext,
  param: string,
  defaultValue?: string
): string | undefined {
  const { query } = context;
  const value = query[param];
  
  if (Array.isArray(value)) {
    return value[0] || defaultValue;
  }
  
  return value || defaultValue;
}

/**
 * Safe JSON parsing for SSR
 */
export function safeJSONParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

/**
 * Generate meta tags for SEO
 */
export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export function generateMetaTags(meta: MetaTags): Record<string, string> {
  const tags: Record<string, string> = {};

  if (meta.title) {
    tags['og:title'] = meta.title;
    tags['twitter:title'] = meta.title;
  }

  if (meta.description) {
    tags['description'] = meta.description;
    tags['og:description'] = meta.description;
    tags['twitter:description'] = meta.description;
  }

  if (meta.keywords && meta.keywords.length > 0) {
    tags['keywords'] = meta.keywords.join(', ');
  }

  if (meta.image) {
    tags['og:image'] = meta.image;
    tags['twitter:image'] = meta.image;
  }

  if (meta.url) {
    tags['og:url'] = meta.url;
    tags['canonical'] = meta.url;
  }

  if (meta.type) {
    tags['og:type'] = meta.type;
  }

  tags['twitter:card'] = 'summary_large_image';

  return tags;
}

/**
 * Cookie management for Next.js API routes
 */
export class NextCookies {
  /**
   * Set cookie in API route
   */
  static set(
    res: any,
    name: string,
    value: string,
    options: {
      maxAge?: number;
      expires?: Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void {
    const defaultOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    };

    const cookieOptions = { ...defaultOptions, ...options };
    
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (cookieOptions.maxAge) {
      cookieString += `; Max-Age=${cookieOptions.maxAge}`;
    }

    if (cookieOptions.expires) {
      cookieString += `; Expires=${cookieOptions.expires.toUTCString()}`;
    }

    if (cookieOptions.path) {
      cookieString += `; Path=${cookieOptions.path}`;
    }

    if (cookieOptions.domain) {
      cookieString += `; Domain=${cookieOptions.domain}`;
    }

    if (cookieOptions.secure) {
      cookieString += '; Secure';
    }

    if (cookieOptions.httpOnly) {
      cookieString += '; HttpOnly';
    }

    if (cookieOptions.sameSite) {
      cookieString += `; SameSite=${cookieOptions.sameSite}`;
    }

    res.setHeader('Set-Cookie', cookieString);
  }

  /**
   * Parse cookies from request
   */
  static parse(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};

    const cookies: Record<string, string> = {};
    const items = cookieHeader.split(';');

    for (const item of items) {
      const [name, value] = item.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }
}

/**
 * Environment-aware configuration
 */
export function getConfig(): {
  isDevelopment: boolean;
  isProduction: boolean;
  isServer: boolean;
  baseUrl: string;
} {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isServer = SSRStorage.isServer();
  
  let baseUrl = '';
  if (!isServer) {
    baseUrl = window.location.origin;
  } else {
    baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BASE_URL || 'http://localhost:3000';
  }

  return {
    isDevelopment,
    isProduction,
    isServer,
    baseUrl
  };
}

/**
 * Dynamic import wrapper for Next.js
 */
export async function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T> {
  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.warn('Dynamic import failed:', error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

/**
 * Image optimization helpers
 */
export interface ImageConfig {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

export function optimizeImageUrl(config: ImageConfig): string {
  const { src, width, height, quality = 75, format = 'auto' } = config;
  
  // If it's an external URL, return as-is
  if (src.startsWith('http')) {
    return src;
  }

  // Build Next.js image optimization URL
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('q', quality.toString());
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (format !== 'auto') params.set('f', format);

  return `/_next/image?${params.toString()}`;
}

/**
 * API route helpers
 */
export class APIHelpers {
  /**
   * Create standardized API response
   */
  static createResponse<T>(
    data: T,
    status = 200,
    message?: string
  ): { data: T; status: number; message?: string; timestamp: string } {
    return {
      data,
      status,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create error response
   */
  static createErrorResponse(
    message: string,
    status = 500,
    details?: any
  ): { error: string; status: number; details?: any; timestamp: string } {
    return {
      error: message,
      status,
      details,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate required fields
   */
  static validateRequired(
    data: Record<string, any>,
    requiredFields: string[]
  ): string[] {
    const missing: string[] = [];
    
    for (const field of requiredFields) {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        missing.push(field);
      }
    }
    
    return missing;
  }
}

/**
 * Redirect helpers for Next.js
 */
export function createRedirect(
  destination: string,
  permanent = false,
  statusCode?: number
): { redirect: { destination: string; permanent: boolean; statusCode?: number } } {
  return {
    redirect: {
      destination,
      permanent,
      statusCode: statusCode || (permanent ? 308 : 307)
    }
  };
}

/**
 * Not found helper
 */
export function createNotFound(): { notFound: true } {
  return { notFound: true };
}
