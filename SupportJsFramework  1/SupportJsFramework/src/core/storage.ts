/**
 * Storage utility functions with JSON serialization
 */

/**
 * Safe localStorage wrapper with JSON serialization
 */
export class LocalStorage {
  /**
   * Set item in localStorage with JSON serialization
   */
  static set<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn('Failed to set localStorage item:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage with JSON deserialization
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('Failed to get localStorage item:', error);
      return null;
    }
  }

  /**
   * Get item with default value
   */
  static getWithDefault<T>(key: string, defaultValue: T): T {
    const value = this.get<T>(key);
    return value !== null ? value : defaultValue;
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove localStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage items
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys in localStorage
   */
  static getKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }

  /**
   * Get storage size in bytes (approximate)
   */
  static getSize(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch {
      return 0;
    }
  }
}

/**
 * Safe sessionStorage wrapper with JSON serialization
 */
export class SessionStorage {
  /**
   * Set item in sessionStorage with JSON serialization
   */
  static set<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn('Failed to set sessionStorage item:', error);
      return false;
    }
  }

  /**
   * Get item from sessionStorage with JSON deserialization
   */
  static get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('Failed to get sessionStorage item:', error);
      return null;
    }
  }

  /**
   * Get item with default value
   */
  static getWithDefault<T>(key: string, defaultValue: T): T {
    const value = this.get<T>(key);
    return value !== null ? value : defaultValue;
  }

  /**
   * Remove item from sessionStorage
   */
  static remove(key: string): boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove sessionStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all sessionStorage items
   */
  static clear(): boolean {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
      return false;
    }
  }

  /**
   * Check if sessionStorage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys in sessionStorage
   */
  static getKeys(): string[] {
    try {
      return Object.keys(sessionStorage);
    } catch {
      return [];
    }
  }
}

/**
 * Cookie management utilities
 */
export class CookieStorage {
  /**
   * Set cookie with options
   */
  static set(
    name: string,
    value: string,
    options: {
      expires?: Date;
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge !== undefined) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Get cookie value
   */
  static get(name: string): string | null {
    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    
    return null;
  }

  /**
   * Remove cookie
   */
  static remove(name: string, path?: string, domain?: string): void {
    this.set(name, '', {
      expires: new Date(0),
      path,
      domain
    });
  }

  /**
   * Check if cookie exists
   */
  static has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Get all cookies
   */
  static getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieStrings = document.cookie.split(';');
    
    for (const cookie of cookieStrings) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }
    
    return cookies;
  }
}

/**
 * Unified storage interface that automatically falls back to alternatives
 */
export class Storage {
  /**
   * Set item with automatic fallback
   */
  static set<T>(key: string, value: T, preferSession = false): boolean {
    if (preferSession && SessionStorage.isAvailable()) {
      return SessionStorage.set(key, value);
    }
    
    if (LocalStorage.isAvailable()) {
      return LocalStorage.set(key, value);
    }
    
    if (SessionStorage.isAvailable()) {
      return SessionStorage.set(key, value);
    }
    
    // Fallback to cookies for simple values
    if (typeof value === 'string' || typeof value === 'number') {
      CookieStorage.set(key, String(value));
      return true;
    }
    
    return false;
  }

  /**
   * Get item with automatic fallback
   */
  static get<T>(key: string, preferSession = false): T | null {
    if (preferSession && SessionStorage.isAvailable()) {
      const value = SessionStorage.get<T>(key);
      if (value !== null) return value;
    }
    
    if (LocalStorage.isAvailable()) {
      const value = LocalStorage.get<T>(key);
      if (value !== null) return value;
    }
    
    if (SessionStorage.isAvailable()) {
      const value = SessionStorage.get<T>(key);
      if (value !== null) return value;
    }
    
    // Fallback to cookies
    const cookieValue = CookieStorage.get(key);
    if (cookieValue !== null) {
      try {
        return JSON.parse(cookieValue) as T;
      } catch {
        return cookieValue as unknown as T;
      }
    }
    
    return null;
  }

  /**
   * Remove item from all storage types
   */
  static remove(key: string): void {
    LocalStorage.remove(key);
    SessionStorage.remove(key);
    CookieStorage.remove(key);
  }
}
