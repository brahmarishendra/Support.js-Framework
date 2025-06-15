import {
  formatDate,
  addDays,
  isToday,
  isYesterday,
  isTomorrow,
  getAge,
  daysDifference,
  isLeapYear,
  startOfDay,
  endOfDay
} from '../../src/core/date';

describe('Date utilities', () => {
  const testDate = new Date('2023-06-15T14:30:00Z');

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2023-06-15');
    });

    it('should format date as MM/DD/YYYY', () => {
      expect(formatDate(testDate, 'MM/DD/YYYY')).toBe('06/15/2023');
    });

    it('should format date as DD/MM/YYYY', () => {
      expect(formatDate(testDate, 'DD/MM/YYYY')).toBe('15/06/2023');
    });

    it('should format date as MMM DD, YYYY', () => {
      expect(formatDate(testDate, 'MMM DD, YYYY')).toBe('Jun 15, 2023');
    });

    it('should format date as MMMM DD, YYYY', () => {
      expect(formatDate(testDate, 'MMMM DD, YYYY')).toBe('June 15, 2023');
    });

    it('should format date with time', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-06-15 14:30:00');
    });
  });

  describe('addDays', () => {
    it('should add positive days', () => {
      const result = addDays(testDate, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should subtract days with negative input', () => {
      const result = addDays(testDate, -5);
      expect(result.getDate()).toBe(10);
    });

    it('should handle month boundaries', () => {
      const endOfMonth = new Date('2023-06-30');
      const result = addDays(endOfMonth, 1);
      expect(result.getMonth()).toBe(6); // July (0-indexed)
      expect(result.getDate()).toBe(1);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for different date', () => {
      expect(isToday(testDate)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday\'s date', () => {
      const yesterday = addDays(new Date(), -1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });
  });

  describe('isTomorrow', () => {
    it('should return true for tomorrow\'s date', () => {
      const tomorrow = addDays(new Date(), 1);
      expect(isTomorrow(tomorrow)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isTomorrow(today)).toBe(false);
    });
  });

  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date('1990-06-15');
      const age = getAge(birthDate);
      expect(age).toBeGreaterThan(30);
    });

    it('should handle birthday not yet reached this year', () => {
      const currentYear = new Date().getFullYear();
      const futureDate = new Date(currentYear, 11, 31); // December 31st
      const age = getAge(futureDate);
      expect(age).toBeLessThan(0);
    });
  });

  describe('daysDifference', () => {
    it('should calculate difference between dates', () => {
      const date1 = new Date('2023-06-15');
      const date2 = new Date('2023-06-20');
      expect(daysDifference(date1, date2)).toBe(5);
    });

    it('should return positive difference regardless of order', () => {
      const date1 = new Date('2023-06-20');
      const date2 = new Date('2023-06-15');
      expect(daysDifference(date1, date2)).toBe(5);
    });
  });

  describe('isLeapYear', () => {
    it('should identify leap years correctly', () => {
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2400)).toBe(true);
    });

    it('should identify non-leap years correctly', () => {
      expect(isLeapYear(2021)).toBe(false);
      expect(isLeapYear(1900)).toBe(false);
      expect(isLeapYear(2100)).toBe(false);
    });
  });

  describe('startOfDay', () => {
    it('should return start of day', () => {
      const result = startOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return end of day', () => {
      const result = endOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });
});
