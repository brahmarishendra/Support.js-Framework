import {
  formatCurrency,
  formatPercentage,
  roundTo,
  clamp,
  randomBetween,
  randomInt,
  isEven,
  isOdd,
  percentage,
  average,
  median,
  sum,
  min,
  max,
  formatBytes,
  toOrdinal,
  lerp,
  mapRange
} from '../../src/core/number';

describe('Number utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency with defaults', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/\$1,234.56/);
    });

    it('should format currency with custom options', () => {
      const result = formatCurrency(1234.56, {
        currency: 'EUR',
        locale: 'de-DE'
      });
      expect(result).toContain('1.234,56');
      expect(result).toContain('€');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$0.00/);
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-100);
      expect(result).toContain('-');
      expect(result).toContain('100');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(0.5)).toMatch(/50(.00)?%/);
      expect(formatPercentage(0.1234, 1)).toMatch(/12.3%/);
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toMatch(/0(.00)?%/);
    });

    it('should handle values greater than 1', () => {
      expect(formatPercentage(1.5)).toMatch(/150(.00)?%/);
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 0)).toBe(3);
      expect(roundTo(3.14159, 4)).toBe(3.1416);
    });

    it('should handle negative numbers', () => {
      expect(roundTo(-3.14159, 2)).toBe(-3.14);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(0, 1, 10)).toBe(1);
      expect(clamp(15, 1, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(1, 1, 10)).toBe(1);
      expect(clamp(10, 1, 10)).toBe(10);
    });
  });

  describe('randomBetween', () => {
    it('should generate numbers within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('randomInt', () => {
    it('should generate integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('isEven', () => {
    it('should identify even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
    });

    it('should identify odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(-1)).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('should identify odd numbers', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(-1)).toBe(true);
    });

    it('should identify even numbers', () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(4)).toBe(false);
      expect(isOdd(0)).toBe(false);
      expect(isOdd(-2)).toBe(false);
    });
  });

  describe('percentage', () => {
    it('should calculate percentages', () => {
      expect(percentage(25, 100)).toBe(25);
      expect(percentage(1, 4)).toBe(25);
      expect(percentage(3, 4)).toBe(75);
    });

    it('should handle division by zero', () => {
      expect(percentage(5, 0)).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20])).toBe(15);
    });

    it('should handle empty array', () => {
      expect(average([])).toBe(0);
    });
  });

  describe('median', () => {
    it('should calculate median for odd length arrays', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
      expect(median([5, 1, 3])).toBe(3);
    });

    it('should calculate median for even length arrays', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
      expect(median([4, 1, 3, 2])).toBe(2.5);
    });

    it('should handle empty array', () => {
      expect(median([])).toBe(0);
    });
  });

  describe('sum', () => {
    it('should calculate sum', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([10, -5])).toBe(5);
    });

    it('should handle empty array', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('min', () => {
    it('should find minimum value', () => {
      expect(min([3, 1, 4, 1, 5])).toBe(1);
      expect(min([-1, -5, -3])).toBe(-5);
    });
  });

  describe('max', () => {
    it('should find maximum value', () => {
      expect(max([3, 1, 4, 1, 5])).toBe(5);
      expect(max([-1, -5, -3])).toBe(-1);
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });

    it('should handle custom decimal places', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB');
      expect(formatBytes(1536, 3)).toBe('1.500 KB');
    });
  });

  describe('toOrdinal', () => {
    it('should convert numbers to ordinals', () => {
      expect(toOrdinal(1)).toBe('1st');
      expect(toOrdinal(2)).toBe('2nd');
      expect(toOrdinal(3)).toBe('3rd');
      expect(toOrdinal(4)).toBe('4th');
      expect(toOrdinal(11)).toBe('11th');
      expect(toOrdinal(21)).toBe('21st');
      expect(toOrdinal(22)).toBe('22nd');
      expect(toOrdinal(23)).toBe('23rd');
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(10, 20, 0.25)).toBe(12.5);
    });
  });

  describe('mapRange', () => {
    it('should map values between ranges', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
      expect(mapRange(2.5, 0, 10, 0, 100)).toBe(25);
    });
  });
});
