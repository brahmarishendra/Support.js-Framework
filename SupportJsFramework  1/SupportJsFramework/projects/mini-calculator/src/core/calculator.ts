/**
 * Calculator Core Logic using Support.js Framework
 * Demonstrates usage of core utilities: number formatting, validation, logging, and performance
 */

import { 
  formatCurrency, 
  roundTo, 
  clamp,
  createLogger,
  debounce,
  memoize
} from '../../../src/core';

// Calculator operation types
export type CalculatorOperation = '+' | '-' | '*' | '/' | '=' | 'clear' | 'backspace';

// Calculator state interface
export interface CalculatorState {
  display: string;
  previousValue: number;
  operation: CalculatorOperation | null;
  waitingForOperand: boolean;
  history: CalculatorHistoryEntry[];
}

// History entry interface
export interface CalculatorHistoryEntry {
  expression: string;
  result: number;
  timestamp: Date;
}

// Calculator configuration
export interface CalculatorConfig {
  maxDigits: number;
  decimalPlaces: number;
  enableHistory: boolean;
  enableLogging: boolean;
}

// Default configuration
const DEFAULT_CONFIG: CalculatorConfig = {
  maxDigits: 12,
  decimalPlaces: 8,
  enableHistory: true,
  enableLogging: true
};

/**
 * Validate if a value is a valid number
 */
function isValidNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Calculator class implementing core calculator functionality
 * Uses Support.js Framework utilities for enhanced features
 */
export class Calculator {
  private state: CalculatorState;
  private config: CalculatorConfig;
  private logger: any;
  
  // Memoized calculation functions for performance
  private memoizedAdd = memoize((a: number, b: number) => a + b);
  private memoizedSubtract = memoize((a: number, b: number) => a - b);
  private memoizedMultiply = memoize((a: number, b: number) => a * b);
  private memoizedDivide = memoize((a: number, b: number) => a / b);
  
  // Debounced display update for performance
  private debouncedDisplayUpdate = debounce((callback: () => void) => callback(), 50);

  constructor(config: Partial<CalculatorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.logger = createLogger({
      level: 'info',
      enableConsole: this.config.enableLogging,
      enableStorage: true,
      prefix: 'Calculator'
    });
    
    this.state = this.getInitialState();
    this.logger.info('Calculator initialized', { config: this.config });
  }

  /**
   * Get initial calculator state
   */
  private getInitialState(): CalculatorState {
    return {
      display: '0',
      previousValue: 0,
      operation: null,
      waitingForOperand: false,
      history: []
    };
  }

  /**
   * Input a digit into the calculator
   */
  inputDigit(digit: string): void {
    this.logger.debug('Input digit', { digit });
    
    if (!this.isValidDigit(digit)) {
      this.logger.warn('Invalid digit input', { digit });
      return;
    }

    if (this.state.waitingForOperand) {
      this.state.display = digit;
      this.state.waitingForOperand = false;
    } else {
      this.state.display = this.state.display === '0' ? digit : this.state.display + digit;
    }

    // Ensure display doesn't exceed max digits
    if (this.state.display.length > this.config.maxDigits) {
      this.state.display = this.state.display.substring(0, this.config.maxDigits);
      this.logger.warn('Display truncated to max digits', { maxDigits: this.config.maxDigits });
    }

    this.debouncedDisplayUpdate(() => {
      this.logger.debug('Display updated', { display: this.state.display });
    });
  }

  /**
   * Input decimal point
   */
  inputDot(): void {
    this.logger.debug('Input decimal point');
    
    if (this.state.waitingForOperand) {
      this.state.display = '0.';
      this.state.waitingForOperand = false;
    } else if (this.state.display.indexOf('.') === -1) {
      this.state.display += '.';
    }
  }

  /**
   * Clear the calculator
   */
  clear(): void {
    this.logger.info('Calculator cleared');
    this.state = this.getInitialState();
  }

  /**
   * Backspace - remove last character
   */
  backspace(): void {
    this.logger.debug('Backspace');
    
    if (this.state.display.length > 1) {
      this.state.display = this.state.display.slice(0, -1);
    } else {
      this.state.display = '0';
    }
  }

  /**
   * Perform calculation operation
   */
  performOperation(nextOperation: CalculatorOperation): void {
    this.logger.debug('Perform operation', { operation: nextOperation });
    
    const inputValue = parseFloat(this.state.display);

    if (!isValidNumber(inputValue)) {
      this.logger.error('Invalid number for operation', { display: this.state.display });
      this.state.display = 'Error';
      return;
    }

    if (this.state.previousValue === 0) {
      this.state.previousValue = inputValue;
    } else if (this.state.operation) {
      const currentValue = this.state.previousValue || 0;
      const result = this.calculate(currentValue, inputValue, this.state.operation);
      
      if (result !== null) {
        // Round result to configured decimal places
        const roundedResult = roundTo(result, this.config.decimalPlaces);
        
        // Clamp result to prevent overflow
        const clampedResult = clamp(roundedResult, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        
        this.state.display = String(clampedResult);
        this.state.previousValue = clampedResult;
        
        // Add to history if enabled
        if (this.config.enableHistory) {
          this.addToHistory(currentValue, inputValue, this.state.operation, clampedResult);
        }
        
        this.logger.info('Calculation completed', {
          expression: `${currentValue} ${this.state.operation} ${inputValue}`,
          result: clampedResult
        });
      }
    }

    this.state.waitingForOperand = true;
    this.state.operation = nextOperation;
  }

  /**
   * Calculate result based on operation
   */
  private calculate(firstValue: number, secondValue: number, operation: CalculatorOperation): number | null {
    try {
      switch (operation) {
        case '+':
          return this.memoizedAdd(firstValue, secondValue);
        case '-':
          return this.memoizedSubtract(firstValue, secondValue);
        case '*':
          return this.memoizedMultiply(firstValue, secondValue);
        case '/':
          if (secondValue === 0) {
            this.logger.error('Division by zero attempted');
            this.state.display = 'Error: Division by zero';
            return null;
          }
          return this.memoizedDivide(firstValue, secondValue);
        default:
          this.logger.warn('Unknown operation', { operation });
          return null;
      }
    } catch (error) {
      this.logger.error('Calculation error', { error, firstValue, secondValue, operation });
      this.state.display = 'Error';
      return null;
    }
  }

  /**
   * Add calculation to history
   */
  private addToHistory(firstValue: number, secondValue: number, operation: CalculatorOperation, result: number): void {
    const historyEntry: CalculatorHistoryEntry = {
      expression: `${firstValue} ${operation} ${secondValue}`,
      result,
      timestamp: new Date()
    };
    
    this.state.history.unshift(historyEntry);
    
    // Keep only last 50 entries
    if (this.state.history.length > 50) {
      this.state.history = this.state.history.slice(0, 50);
    }
    
    this.logger.debug('Added to history', historyEntry);
  }

  /**
   * Validate digit input
   */
  private isValidDigit(digit: string): boolean {
    return /^[0-9]$/.test(digit);
  }

  /**
   * Get current display value
   */
  getDisplay(): string {
    return this.state.display;
  }

  /**
   * Get current display as formatted currency
   */
  getDisplayAsCurrency(currency = 'USD'): string {
    const value = parseFloat(this.state.display);
    if (isValidNumber(value)) {
      return formatCurrency(value, { currency });
    }
    return this.state.display;
  }

  /**
   * Get calculation history
   */
  getHistory(): CalculatorHistoryEntry[] {
    return [...this.state.history];
  }

  /**
   * Get current state (for debugging/testing)
   */
  getState(): CalculatorState {
    return { ...this.state };
  }

  /**
   * Export calculator logs
   */
  exportLogs(): string {
    return this.logger.exportLogs();
  }

  /**
   * Clear calculator history
   */
  clearHistory(): void {
    this.state.history = [];
    this.logger.info('History cleared');
  }

  /**
   * Update calculator configuration
   */
  updateConfig(newConfig: Partial<CalculatorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Configuration updated', { config: this.config });
  }
}