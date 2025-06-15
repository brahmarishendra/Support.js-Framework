/**
 * Logger utility with multiple log levels and formatting
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  prefix?: string;
  enableTimestamp: boolean;
  enableStackTrace: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  enableConsole: true,
  enableStorage: false,
  maxStorageEntries: 1000,
  enableTimestamp: true,
  enableStackTrace: false
};

export class Logger {
  private config: LoggerConfig;
  private entries: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Log levels in order of severity
   */
  private static readonly LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  /**
   * Check if message should be logged based on current log level
   */
  private shouldLog(level: LogLevel): boolean {
    return Logger.LEVELS[level] >= Logger.LEVELS[this.config.level];
  }

  /**
   * Format log message
   */
  private formatMessage(level: LogLevel, message: string): string {
    let formatted = '';

    if (this.config.prefix) {
      formatted += `[${this.config.prefix}] `;
    }

    if (this.config.enableTimestamp) {
      formatted += `${new Date().toISOString()} `;
    }

    formatted += `[${level.toUpperCase()}] ${message}`;

    return formatted;
  }

  /**
   * Get stack trace
   */
  private getStackTrace(): string {
    const stack = new Error().stack;
    if (!stack) return '';
    
    const lines = stack.split('\n');
    // Remove first 3 lines (Error, getStackTrace, log method)
    return lines.slice(3).join('\n');
  }

  /**
   * Log message
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data
    };

    // Store entry if storage is enabled
    if (this.config.enableStorage) {
      this.entries.push(entry);
      
      // Limit storage entries
      if (this.entries.length > this.config.maxStorageEntries) {
        this.entries.shift();
      }
    }

    // Log to console if enabled
    if (this.config.enableConsole) {
      const formattedMessage = this.formatMessage(level, message);
      
      const logMethod = level === 'debug' ? console.debug :
                       level === 'info' ? console.info :
                       level === 'warn' ? console.warn :
                       console.error;

      if (data !== undefined) {
        logMethod(formattedMessage, data);
      } else {
        logMethod(formattedMessage);
      }

      // Log stack trace for errors if enabled
      if (level === 'error' && this.config.enableStackTrace) {
        console.error('Stack trace:', this.getStackTrace());
      }
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Error level logging
   */
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Get all stored log entries
   */
  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  /**
   * Get entries by level
   */
  getEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.entries.filter(entry => entry.level === level);
  }

  /**
   * Clear stored entries
   */
  clearEntries(): void {
    this.entries = [];
  }

  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Create a child logger with a prefix
   */
  child(prefix: string): Logger {
    const childPrefix = this.config.prefix 
      ? `${this.config.prefix}:${prefix}` 
      : prefix;
    
    return new Logger({
      ...this.config,
      prefix: childPrefix
    });
  }

  /**
   * Group related logs
   */
  group(label: string, collapsed = false): void {
    if (this.config.enableConsole) {
      if (collapsed) {
        console.groupCollapsed(label);
      } else {
        console.group(label);
      }
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.config.enableConsole) {
      console.groupEnd();
    }
  }

  /**
   * Log a table
   */
  table(data: any): void {
    if (this.config.enableConsole && this.shouldLog('info')) {
      console.table(data);
    }
  }

  /**
   * Start a timer
   */
  time(label: string): void {
    if (this.config.enableConsole && this.shouldLog('debug')) {
      console.time(label);
    }
  }

  /**
   * End a timer
   */
  timeEnd(label: string): void {
    if (this.config.enableConsole && this.shouldLog('debug')) {
      console.timeEnd(label);
    }
  }
}

/**
 * Create a logger instance with default configuration
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

/**
 * Default logger instance
 */
export const logger = createLogger();

/**
 * Convenience functions using default logger
 */
export const debug = (message: string, data?: any): void => logger.debug(message, data);
export const info = (message: string, data?: any): void => logger.info(message, data);
export const warn = (message: string, data?: any): void => logger.warn(message, data);
export const error = (message: string, data?: any): void => logger.error(message, data);
