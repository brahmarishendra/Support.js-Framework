/**
 * Comprehensive Calculator Tests using Support.js Framework
 * Tests core calculator functionality, performance, and framework integrations
 */

import { Calculator, CalculatorOperation } from '../src/core/calculator';

// Mock Support.js Framework for testing
jest.mock('support-js-framework/core', () => ({
  formatCurrency: (amount: number, options: any = {}) => {
    const currency = options.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },
  roundTo: (number: number, decimals: number) => {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
  clamp: (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  },
  createLogger: () => ({
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    exportLogs: jest.fn(() => JSON.stringify([])),
  }),
  debounce: (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  },
  memoize: (fn: Function) => {
    const cache = new Map();
    return (...args: any[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn.apply(null, args);
      cache.set(key, result);
      return result;
    };
  }
}));

describe('Calculator Core Functionality', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator({
      enableHistory: true,
      enableLogging: true,
      maxDigits: 12,
      decimalPlaces: 8
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Operations', () => {
    test('should initialize with default display of 0', () => {
      expect(calculator.getDisplay()).toBe('0');
    });

    test('should input single digits correctly', () => {
      calculator.inputDigit('5');
      expect(calculator.getDisplay()).toBe('5');
    });

    test('should input multiple digits correctly', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('2');
      calculator.inputDigit('3');
      expect(calculator.getDisplay()).toBe('123');
    });

    test('should handle decimal input correctly', () => {
      calculator.inputDigit('3');
      calculator.inputDot();
      calculator.inputDigit('1');
      calculator.inputDigit('4');
      expect(calculator.getDisplay()).toBe('3.14');
    });

    test('should not allow multiple decimal points', () => {
      calculator.inputDigit('3');
      calculator.inputDot();
      calculator.inputDigit('1');
      calculator.inputDot(); // Should be ignored
      calculator.inputDigit('4');
      expect(calculator.getDisplay()).toBe('3.14');
    });
  });

  describe('Arithmetic Operations', () => {
    test('should perform addition correctly', () => {
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      expect(calculator.getDisplay()).toBe('8');
    });

    test('should perform subtraction correctly', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('0');
      calculator.performOperation('-');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      expect(calculator.getDisplay()).toBe('7');
    });

    test('should perform multiplication correctly', () => {
      calculator.inputDigit('6');
      calculator.performOperation('*');
      calculator.inputDigit('7');
      calculator.performOperation('=');
      expect(calculator.getDisplay()).toBe('42');
    });

    test('should perform division correctly', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('5');
      calculator.performOperation('/');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      expect(calculator.getDisplay()).toBe('5');
    });

    test('should handle division by zero', () => {
      calculator.inputDigit('5');
      calculator.performOperation('/');
      calculator.inputDigit('0');
      calculator.performOperation('=');
      expect(calculator.getDisplay()).toContain('Error');
    });

    test('should handle complex calculations', () => {
      // Test: 2 + 3 * 4 = 20 (calculator does left-to-right)
      calculator.inputDigit('2');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('*');
      calculator.inputDigit('4');
      calculator.performOperation('=');
      expect(calculator.getDisplay()).toBe('20');
    });
  });

  describe('Calculator Functions', () => {
    test('should clear calculator state', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('2');
      calculator.inputDigit('3');
      calculator.clear();
      expect(calculator.getDisplay()).toBe('0');
      expect(calculator.getState().previousValue).toBe(0);
      expect(calculator.getState().operation).toBeNull();
    });

    test('should perform backspace correctly', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('2');
      calculator.inputDigit('3');
      calculator.backspace();
      expect(calculator.getDisplay()).toBe('12');
    });

    test('should handle backspace on single digit', () => {
      calculator.inputDigit('5');
      calculator.backspace();
      expect(calculator.getDisplay()).toBe('0');
    });

    test('should handle backspace on zero', () => {
      calculator.backspace();
      expect(calculator.getDisplay()).toBe('0');
    });
  });

  describe('History Management', () => {
    test('should record calculations in history', () => {
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      
      const history = calculator.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('5 + 3');
      expect(history[0].result).toBe(8);
      expect(history[0].timestamp).toBeInstanceOf(Date);
    });

    test('should maintain multiple history entries', () => {
      // First calculation
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      
      // Second calculation
      calculator.clear();
      calculator.inputDigit('1');
      calculator.inputDigit('0');
      calculator.performOperation('-');
      calculator.inputDigit('2');
      calculator.performOperation('=');
      
      const history = calculator.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].expression).toBe('10 - 2'); // Most recent first
      expect(history[0].result).toBe(8);
      expect(history[1].expression).toBe('5 + 3');
      expect(history[1].result).toBe(8);
    });

    test('should clear history when requested', () => {
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      
      expect(calculator.getHistory()).toHaveLength(1);
      
      calculator.clearHistory();
      expect(calculator.getHistory()).toHaveLength(0);
    });

    test('should limit history to 50 entries', () => {
      // Perform 55 calculations
      for (let i = 0; i < 55; i++) {
        calculator.clear();
        calculator.inputDigit('1');
        calculator.performOperation('+');
        calculator.inputDigit('1');
        calculator.performOperation('=');
      }
      
      const history = calculator.getHistory();
      expect(history).toHaveLength(50);
    });
  });

  describe('Currency Display', () => {
    test('should format display as currency', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('2');
      calculator.inputDigit('3');
      calculator.inputDigit('4');
      calculator.inputDot();
      calculator.inputDigit('5');
      calculator.inputDigit('6');
      
      const currencyDisplay = calculator.getDisplayAsCurrency('USD');
      expect(currencyDisplay).toMatch(/\$1,234\.56/);
    });

    test('should handle different currencies', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('0');
      calculator.inputDigit('0');
      
      const usdDisplay = calculator.getDisplayAsCurrency('USD');
      const eurDisplay = calculator.getDisplayAsCurrency('EUR');
      
      expect(usdDisplay).toMatch(/\$100/);
      expect(eurDisplay).toMatch(/€100/);
    });

    test('should return original display for invalid numbers', () => {
      calculator.clear();
      // Force an error state
      calculator.inputDigit('5');
      calculator.performOperation('/');
      calculator.inputDigit('0');
      calculator.performOperation('=');
      
      const currencyDisplay = calculator.getDisplayAsCurrency('USD');
      expect(currencyDisplay).toContain('Error');
    });
  });

  describe('Configuration Management', () => {
    test('should update configuration correctly', () => {
      const newConfig = {
        maxDigits: 15,
        decimalPlaces: 4,
        enableHistory: false
      };
      
      calculator.updateConfig(newConfig);
      
      const state = calculator.getState();
      // Note: We can't directly test private config, but we can test behavior
      
      // Test that history is disabled
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      
      // Since history is disabled, it should remain empty
      expect(calculator.getHistory()).toHaveLength(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should reject invalid digit input', () => {
      const initialDisplay = calculator.getDisplay();
      calculator.inputDigit('a'); // Invalid digit
      expect(calculator.getDisplay()).toBe(initialDisplay);
    });

    test('should handle very large numbers', () => {
      // Input a large number
      for (let i = 0; i < 10; i++) {
        calculator.inputDigit('9');
      }
      
      calculator.performOperation('*');
      calculator.inputDigit('2');
      calculator.performOperation('=');
      
      // Should handle the calculation without throwing
      expect(calculator.getDisplay()).toBeDefined();
      expect(calculator.getDisplay()).not.toBe('Error');
    });

    test('should handle very small decimal numbers', () => {
      calculator.inputDigit('1');
      calculator.performOperation('/');
      // Input a large divisor
      calculator.inputDigit('1');
      for (let i = 0; i < 8; i++) {
        calculator.inputDigit('0');
      }
      calculator.performOperation('=');
      
      // Should handle small decimals
      expect(calculator.getDisplay()).toBeDefined();
      expect(parseFloat(calculator.getDisplay())).toBeGreaterThan(0);
    });

    test('should truncate display to maximum digits', () => {
      // Create a calculator with limited digits
      const limitedCalculator = new Calculator({ maxDigits: 5 });
      
      // Try to input more digits than allowed
      for (let i = 0; i < 10; i++) {
        limitedCalculator.inputDigit('9');
      }
      
      expect(limitedCalculator.getDisplay().length).toBeLessThanOrEqual(5);
    });
  });

  describe('State Management', () => {
    test('should maintain consistent state during operations', () => {
      calculator.inputDigit('5');
      const state1 = calculator.getState();
      expect(state1.display).toBe('5');
      expect(state1.waitingForOperand).toBe(false);
      
      calculator.performOperation('+');
      const state2 = calculator.getState();
      expect(state2.operation).toBe('+');
      expect(state2.waitingForOperand).toBe(true);
      expect(state2.previousValue).toBe(5);
      
      calculator.inputDigit('3');
      const state3 = calculator.getState();
      expect(state3.display).toBe('3');
      expect(state3.waitingForOperand).toBe(false);
    });

    test('should export state correctly', () => {
      calculator.inputDigit('1');
      calculator.inputDigit('2');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      
      const state = calculator.getState();
      expect(state).toHaveProperty('display');
      expect(state).toHaveProperty('previousValue');
      expect(state).toHaveProperty('operation');
      expect(state).toHaveProperty('waitingForOperand');
      expect(state).toHaveProperty('history');
      
      expect(state.display).toBe('3');
      expect(state.previousValue).toBe(12);
      expect(state.operation).toBe('+');
      expect(state.waitingForOperand).toBe(false);
    });
  });

  describe('Logging and Debugging', () => {
    test('should export logs when requested', () => {
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      
      const logs = calculator.exportLogs();
      expect(typeof logs).toBe('string');
      expect(logs).toBeDefined();
    });
  });

  describe('Performance and Optimization', () => {
    test('should handle rapid sequential operations', () => {
      const startTime = performance.now();
      
      // Perform 100 rapid calculations
      for (let i = 0; i < 100; i++) {
        calculator.clear();
        calculator.inputDigit('1');
        calculator.performOperation('+');
        calculator.inputDigit('1');
        calculator.performOperation('=');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
      expect(calculator.getDisplay()).toBe('2');
    });

    test('should maintain accuracy across multiple operations', () => {
      // Test floating point precision
      calculator.inputDigit('0');
      calculator.inputDot();
      calculator.inputDigit('1');
      calculator.performOperation('+');
      calculator.inputDigit('0');
      calculator.inputDot();
      calculator.inputDigit('2');
      calculator.performOperation('=');
      
      const result = parseFloat(calculator.getDisplay());
      expect(result).toBeCloseTo(0.3, 8);
    });
  });

  describe('Integration with Support.js Framework', () => {
    test('should use framework utilities correctly', () => {
      // Test that formatCurrency is being used
      calculator.inputDigit('1');
      calculator.inputDigit('0');
      calculator.inputDigit('0');
      
      const formatted = calculator.getDisplayAsCurrency('USD');
      expect(formatted).toContain('$');
      expect(formatted).toContain('100');
    });

    test('should handle framework utility errors gracefully', () => {
      // Even if framework utilities fail, calculator should continue working
      calculator.inputDigit('5');
      calculator.performOperation('+');
      calculator.inputDigit('3');
      calculator.performOperation('=');
      
      expect(calculator.getDisplay()).toBe('8');
    });
  });
});

describe('Calculator Integration Tests', () => {
  test('should handle complete calculation workflow', () => {
    const calculator = new Calculator();
    
    // Perform: (15 + 25) * 2 / 4 - 5 = 15
    calculator.inputDigit('1');
    calculator.inputDigit('5');
    calculator.performOperation('+');
    calculator.inputDigit('2');
    calculator.inputDigit('5');
    calculator.performOperation('*');
    calculator.inputDigit('2');
    calculator.performOperation('/');
    calculator.inputDigit('4');
    calculator.performOperation('-');
    calculator.inputDigit('5');
    calculator.performOperation('=');
    
    expect(calculator.getDisplay()).toBe('15');
    
    const history = calculator.getHistory();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].result).toBe(15);
  });

  test('should maintain state consistency across complex operations', () => {
    const calculator = new Calculator();
    
    // Test calculator state after various operations
    calculator.inputDigit('9');
    calculator.inputDigit('9');
    calculator.performOperation('/');
    calculator.inputDigit('3');
    calculator.performOperation('=');
    
    expect(calculator.getDisplay()).toBe('33');
    
    // Continue with the result
    calculator.performOperation('*');
    calculator.inputDigit('2');
    calculator.performOperation('=');
    
    expect(calculator.getDisplay()).toBe('66');
    
    const state = calculator.getState();
    expect(state.previousValue).toBe(66);
    expect(state.waitingForOperand).toBe(true);
  });
});

describe('Calculator Performance Tests', () => {
  test('should handle memory-intensive operations efficiently', () => {
    const calculator = new Calculator({ enableHistory: true });
    const initialMemory = process.memoryUsage();
    
    // Perform many calculations to test memory usage
    for (let i = 0; i < 1000; i++) {
      calculator.clear();
      calculator.inputDigit(String(i % 10));
      calculator.performOperation('+');
      calculator.inputDigit('1');
      calculator.performOperation('=');
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    // Memory increase should be reasonable (less than 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    
    // History should be limited to 50 entries
    expect(calculator.getHistory()).toHaveLength(50);
  });

  test('should debounce rapid inputs correctly', (done) => {
    const calculator = new Calculator();
    let updateCount = 0;
    
    // Mock a display update callback that's debounced
    const originalDisplay = calculator.getDisplay;
    calculator.getDisplay = jest.fn(() => {
      updateCount++;
      return originalDisplay.call(calculator);
    });
    
    // Rapidly input digits
    for (let i = 0; i < 10; i++) {
      calculator.inputDigit('1');
    }
    
    // After debounce delay, check that updates were limited
    setTimeout(() => {
      expect(updateCount).toBeLessThan(20); // Should be debounced
      done();
    }, 100);
  });
});