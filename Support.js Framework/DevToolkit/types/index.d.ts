// Type definitions for support.js library

declare module 'support.js' {
  // Utils
  export namespace dateUtils {
    export function formatDate(date: Date, format: string, options?: { locale?: string; timeZone?: string }): string;
    export function getRelativeTime(date: Date, baseDate?: Date): string;
    export function addDays(date: Date, days: number): Date;
    export function isToday(date: Date): boolean;
    export function startOfDay(date: Date): Date;
    export function endOfDay(date: Date): Date;
    export function isSameDay(date1: Date, date2: Date): boolean;
  }

  export namespace stringUtils {
    export function toCamelCase(str: string): string;
    export function toKebabCase(str: string): string;
    export function toSnakeCase(str: string): string;
    export function capitalize(str: string): string;
    export function truncate(str: string, length: number, suffix?: string): string;
    export function cleanWhitespace(str: string): string;
    export function isValidEmail(email: string): boolean;
    export function randomString(length: number, charset?: string): string;
    export function pluralize(word: string, count: number, pluralForm?: string): string;
    export function escapeHtml(str: string): string;
  }

  export namespace numberUtils {
    export function formatCurrency(amount: number, currency: string, locale?: string): string;
    export function toPercentage(value: number, decimals?: number): string;
    export function clamp(value: number, min: number, max: number): number;
    export function randomBetween(min: number, max: number): number;
    export function roundTo(value: number, decimals: number): number;
    export function formatNumber(value: number, locale?: string): string;
    export function formatBytes(bytes: number, decimals?: number): string;
    export function inRange(value: number, min: number, max: number): boolean;
    export function average(numbers: number[]): number;
    export function sum(numbers: number[]): number;
    export function median(numbers: number[]): number;
  }

  // React Components and Hooks
  export interface CustomButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  }

  export interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export interface WindowSize {
    width: number;
    height: number;
  }

  export const CustomButton: React.FC<CustomButtonProps>;
  export const LoadingSpinner: React.FC<LoadingSpinnerProps>;
  
  export function useWindowSize(): WindowSize;
  export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void];

  // Angular Services
  export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
  }

  export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    args?: any[];
    source?: string;
  }

  export interface HttpInterceptorConfig {
    enableLogging?: boolean;
    enableLoadingIndicator?: boolean;
    enableRetry?: boolean;
    retryCount?: number;
    retryDelay?: number;
  }

  export class LoggerService {
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    getLogs(): LogEntry[];
    clearLogs(): void;
    getLogsByLevel(level: LogLevel): LogEntry[];
    exportLogs(): string;
  }

  export class HttpInterceptorService {
    configure(config: Partial<HttpInterceptorConfig>): void;
    isLoading(): boolean;
    getActiveRequestCount(): number;
  }

  // Library metadata
  export const version: string;
  export const libraryInfo: {
    name: string;
    version: string;
    description: string;
    author: string;
    frameworks: string[];
  };
}

declare module 'support.js/utils' {
  export * from 'support.js';
}

declare module 'support.js/react' {
  export * from 'support.js';
}

declare module 'support.js/angular' {
  export * from 'support.js';
}
