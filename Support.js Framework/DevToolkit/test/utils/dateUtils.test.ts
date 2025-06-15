import {
  formatDate,
  getRelativeTime,
  addDays,
  isToday,
  startOfDay,
  endOfDay,
  isSameDay
} from '../../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date with YYYY-MM-DD format', () => {
      const date = new Date(2023, 5, 15); // June 15, 2023
      const result = formatDate(date, 'YYYY-MM-DD');
      expect(result).toBe('2023-06-15');
    });

    it('should format date with time', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45); // June 15, 2023 14:30:45
      const result = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2023-06-15 14:30:45');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "just now" for recent times', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30000); // 30 seconds ago
      const result = getRelativeTime(recent, now);
      expect(result).toBe('just now');
    });

    it('should return minutes ago', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
      const result = getRelativeTime(past, now);
      expect(result).toBe('5 minutes ago');
    });

    it('should return hours ago', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
      const result = getRelativeTime(past, now);
      expect(result).toBe('3 hours ago');
    });

    it('should return future times', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours in future
      const result = getRelativeTime(future, now);
      expect(result).toBe('in 2 hours');
    });
  });

  describe('addDays', () => {
    it('should add positive days', () => {
      const date = new Date(2023, 5, 15);
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should subtract days with negative input', () => {
      const date = new Date(2023, 5, 15);
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('startOfDay', () => {
    it('should return start of day', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      const result = startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return end of day', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      const result = endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2023, 5, 15, 10, 0, 0);
      const date2 = new Date(2023, 5, 15, 20, 0, 0);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2023, 5, 15);
      const date2 = new Date(2023, 5, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });
});
