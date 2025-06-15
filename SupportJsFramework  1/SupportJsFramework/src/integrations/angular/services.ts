/**
 * Angular services for support-js-framework
 */

import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, throttleTime, distinctUntilChanged } from 'rxjs/operators';

import { Logger, createLogger, LoggerConfig } from '../../core/logger';
import { LocalStorage, SessionStorage } from '../../core/storage';
import { getBrowserInfo, BrowserInfo } from '../../core/browser';

/**
 * Logger service for Angular
 */
@Injectable({
  providedIn: 'root'
})
export class SupportLoggerService {
  private logger: Logger;

  constructor(@Optional() config?: Partial<LoggerConfig>) {
    this.logger = createLogger({
      prefix: 'Angular',
      enableConsole: true,
      enableStorage: true,
      ...config
    });
  }

  debug(message: string, data?: any): void {
    this.logger.debug(message, data);
  }

  info(message: string, data?: any): void {
    this.logger.info(message, data);
  }

  warn(message: string, data?: any): void {
    this.logger.warn(message, data);
  }

  error(message: string, data?: any): void {
    this.logger.error(message, data);
  }

  createChild(prefix: string): Logger {
    return this.logger.child(prefix);
  }

  getEntries() {
    return this.logger.getEntries();
  }

  exportLogs(): string {
    return this.logger.exportLogs();
  }
}

/**
 * Storage service for Angular
 */
@Injectable({
  providedIn: 'root'
})
export class SupportStorageService {
  /**
   * Local storage methods
   */
  setLocal<T>(key: string, value: T): boolean {
    return LocalStorage.set(key, value);
  }

  getLocal<T>(key: string): T | null {
    return LocalStorage.get<T>(key);
  }

  getLocalWithDefault<T>(key: string, defaultValue: T): T {
    return LocalStorage.getWithDefault(key, defaultValue);
  }

  removeLocal(key: string): boolean {
    return LocalStorage.remove(key);
  }

  clearLocal(): boolean {
    return LocalStorage.clear();
  }

  /**
   * Session storage methods
   */
  setSession<T>(key: string, value: T): boolean {
    return SessionStorage.set(key, value);
  }

  getSession<T>(key: string): T | null {
    return SessionStorage.get<T>(key);
  }

  getSessionWithDefault<T>(key: string, defaultValue: T): T {
    return SessionStorage.getWithDefault(key, defaultValue);
  }

  removeSession(key: string): boolean {
    return SessionStorage.remove(key);
  }

  clearSession(): boolean {
    return SessionStorage.clear();
  }

  /**
   * Check storage availability
   */
  isLocalStorageAvailable(): boolean {
    return LocalStorage.isAvailable();
  }

  isSessionStorageAvailable(): boolean {
    return SessionStorage.isAvailable();
  }
}

/**
 * Browser detection service
 */
@Injectable({
  providedIn: 'root'
})
export class SupportBrowserService {
  private browserInfo: BrowserInfo;

  constructor() {
    this.browserInfo = getBrowserInfo();
  }

  getBrowserInfo(): BrowserInfo {
    return this.browserInfo;
  }

  isMobile(): boolean {
    return this.browserInfo.isMobile;
  }

  isTablet(): boolean {
    return this.browserInfo.isTablet;
  }

  isDesktop(): boolean {
    return this.browserInfo.isDesktop;
  }

  getBrowserName(): string {
    return this.browserInfo.name;
  }

  getBrowserVersion(): string {
    return this.browserInfo.version;
  }

  getOS(): string {
    return this.browserInfo.os;
  }
}

/**
 * Performance service for debounce and throttle
 */
@Injectable({
  providedIn: 'root'
})
export class SupportPerformanceService {
  /**
   * Create debounced observable
   */
  createDebouncedObservable<T>(
    source: Observable<T>,
    delay: number
  ): Observable<T> {
    return source.pipe(
      debounceTime(delay),
      distinctUntilChanged()
    );
  }

  /**
   * Create throttled observable
   */
  createThrottledObservable<T>(
    source: Observable<T>,
    delay: number
  ): Observable<T> {
    return source.pipe(
      throttleTime(delay),
      distinctUntilChanged()
    );
  }

  /**
   * Create debounced window resize observable
   */
  createResizeObservable(delay = 100): Observable<Event> {
    return fromEvent(window, 'resize').pipe(
      debounceTime(delay)
    );
  }

  /**
   * Create throttled scroll observable
   */
  createScrollObservable(delay = 16): Observable<Event> {
    return fromEvent(window, 'scroll').pipe(
      throttleTime(delay)
    );
  }
}

/**
 * Reactive state management service
 */
@Injectable({
  providedIn: 'root'
})
export class SupportStateService<T = any> {
  private state$ = new BehaviorSubject<T | null>(null);

  /**
   * Get state observable
   */
  getState(): Observable<T | null> {
    return this.state$.asObservable();
  }

  /**
   * Get current state value
   */
  getCurrentState(): T | null {
    return this.state$.value;
  }

  /**
   * Update state
   */
  setState(newState: T): void {
    this.state$.next(newState);
  }

  /**
   * Update state with partial data
   */
  updateState(partialState: Partial<T>): void {
    const currentState = this.getCurrentState();
    if (currentState && typeof currentState === 'object') {
      this.setState({ ...currentState, ...partialState } as T);
    }
  }

  /**
   * Reset state
   */
  resetState(): void {
    this.state$.next(null);
  }

  /**
   * Create derived state observable
   */
  select<K>(selector: (state: T | null) => K): Observable<K> {
    return this.state$.pipe(
      distinctUntilChanged(),
      debounceTime(0) // Ensure async behavior
    );
  }
}

/**
 * HTTP error handling service
 */
@Injectable({
  providedIn: 'root'
})
export class SupportErrorService {
  private errorSubject = new BehaviorSubject<Error | null>(null);

  constructor(private logger: SupportLoggerService) {}

  /**
   * Get error observable
   */
  getErrors(): Observable<Error | null> {
    return this.errorSubject.asObservable();
  }

  /**
   * Handle error
   */
  handleError(error: Error, context?: string): void {
    const errorMessage = context ? `${context}: ${error.message}` : error.message;
    
    this.logger.error(errorMessage, {
      error: error.name,
      stack: error.stack,
      context
    });

    this.errorSubject.next(error);
  }

  /**
   * Clear current error
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Create error handler function
   */
  createErrorHandler(context: string) {
    return (error: Error) => this.handleError(error, context);
  }
}

/**
 * Utility service for common operations
 */
@Injectable({
  providedIn: 'root'
})
export class SupportUtilsService {
  constructor(
    private storage: SupportStorageService,
    private logger: SupportLoggerService,
    private browser: SupportBrowserService
  ) {}

  /**
   * Generate unique ID
   */
  generateId(prefix = 'id'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (error) {
      this.logger.error('Failed to copy to clipboard', error);
      return false;
    }
  }

  /**
   * Download data as file
   */
  downloadFile(data: string, filename: string, type = 'text/plain'): void {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate form data
   */
  validateForm(data: Record<string, any>, rules: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`;
        continue;
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        continue;
      }
      
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors[field] = `${field} must be no more than ${rule.maxLength} characters`;
        continue;
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
        continue;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
