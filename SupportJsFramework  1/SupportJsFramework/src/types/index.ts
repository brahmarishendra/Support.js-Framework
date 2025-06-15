/**
 * Type definitions for support-js-framework
 */

// Core utility types
export type { DateFormat } from '../core/date';
export type { CurrencyOptions } from '../core/number';
export type { LogLevel, LogEntry, LoggerConfig } from '../core/logger';
export type { RGB, HSL } from '../core/color';
export type { BrowserInfo } from '../core/browser';

// Framework integration types
export interface FrameworkIntegration {
  name: 'react' | 'nextjs' | 'angular' | 'vue' | 'svelte';
  version: string;
  features: string[];
}

// Utility function types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;

export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// API response types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  status: number;
  details?: any;
  timestamp: string;
}

// Storage types
export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expiry?: number;
}

// Performance types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Color types
export interface ColorPalette {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Configuration types
export interface SupportConfig {
  logger?: Partial<LoggerConfig>;
  storage?: {
    prefix?: string;
    encrypt?: boolean;
    compression?: boolean;
  };
  performance?: {
    enableMetrics?: boolean;
    sampleRate?: number;
  };
  features?: {
    enableColorUtils?: boolean;
    enableStorageUtils?: boolean;
    enablePerformanceUtils?: boolean;
    enableValidationUtils?: boolean;
  };
}

// Hook types for React integration
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// Component types for React integration
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Angular types
export interface AngularPipeOptions {
  pure?: boolean;
  standalone?: boolean;
}

// Next.js types
export interface NextjsConfig {
  enableSSR?: boolean;
  enableSEO?: boolean;
  enableImageOptimization?: boolean;
}

// Plugin types
export interface SupportPlugin {
  name: string;
  version: string;
  install: (config?: any) => void;
  uninstall: () => void;
}

// Utility types for advanced operations
export type Flatten<T> = T extends Array<infer U> ? U : T;

export type DeepFlatten<T> = T extends Array<infer U>
  ? DeepFlatten<U>
  : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>;

export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

// Function types
export type Predicate<T> = (item: T) => boolean;

export type Mapper<T, U> = (item: T, index?: number) => U;

export type Reducer<T, U> = (accumulator: U, current: T, index?: number) => U;

export type Comparator<T> = (a: T, b: T) => number;

// Environment types
export interface EnvironmentInfo {
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  platform: 'browser' | 'node' | 'electron' | 'unknown';
  version: string;
}

// Theme types
export interface Theme {
  colors: ColorPalette;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  breakpoints: Record<string, string>;
}

// Error types
export interface SupportError extends Error {
  code?: string;
  context?: any;
  timestamp: Date;
}

// Module types
export interface ModuleInfo {
  name: string;
  version: string;
  dependencies: string[];
  size: number;
  treeshakeable: boolean;
}

// Export utility type helpers
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

export type Push<T extends any[], V> = [...T, V];

export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

// Generic utility types
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type Constructor<T = {}> = new (...args: any[]) => T;

export type Mixin<T extends Constructor> = T & Constructor;
