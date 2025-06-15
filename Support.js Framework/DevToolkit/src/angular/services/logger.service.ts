import { Injectable } from '@angular/core';

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

/**
 * A comprehensive logging service for Angular applications
 */
@Injectable()
export class LoggerService {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogEntries: number = 1000;

  constructor() {
    // Set log level based on environment
    if (typeof window !== 'undefined') {
      const isDevelopment = !window.location.hostname.includes('localhost') === false;
      this.logLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    }
  }

  /**
   * Set the current log level
   * @param level - The log level to set
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get the current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Log an error message
   * @param message - The error message
   * @param args - Additional arguments
   */
  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, args);
  }

  /**
   * Log a warning message
   * @param message - The warning message
   * @param args - Additional arguments
   */
  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }

  /**
   * Log an info message
   * @param message - The info message
   * @param args - Additional arguments
   */
  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }

  /**
   * Log a debug message
   * @param message - The debug message
   * @param args - Additional arguments
   */
  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, args);
  }

  /**
   * Internal log method
   * @param level - The log level
   * @param message - The message
   * @param args - Additional arguments
   */
  private log(level: LogLevel, message: string, args?: any[]): void {
    if (level > this.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      args,
      source: this.getCallerInfo()
    };

    // Add to internal log storage
    this.logs.push(logEntry);

    // Maintain max log entries
    if (this.logs.length > this.maxLogEntries) {
      this.logs.shift();
    }

    // Output to console
    this.outputToConsole(logEntry);
  }

  /**
   * Output log entry to console
   * @param logEntry - The log entry
   */
  private outputToConsole(logEntry: LogEntry): void {
    const timestamp = logEntry.timestamp.toISOString();
    const levelName = LogLevel[logEntry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    const consoleArgs = logEntry.args || [];

    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(prefix, logEntry.message, ...consoleArgs);
        break;
      case LogLevel.WARN:
        console.warn(prefix, logEntry.message, ...consoleArgs);
        break;
      case LogLevel.INFO:
        console.info(prefix, logEntry.message, ...consoleArgs);
        break;
      case LogLevel.DEBUG:
        console.debug(prefix, logEntry.message, ...consoleArgs);
        break;
    }
  }

  /**
   * Get caller information (simplified)
   */
  private getCallerInfo(): string {
    try {
      throw new Error();
    } catch (error) {
      if (error instanceof Error && error.stack) {
        const stackLines = error.stack.split('\n');
        // Try to get meaningful caller info (this is browser-dependent)
        return stackLines[4] || 'unknown';
      }
      return 'unknown';
    }
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get logs by level
   * @param level - The log level to filter by
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Export logs as JSON string
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
