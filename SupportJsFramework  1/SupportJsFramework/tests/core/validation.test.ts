import {
  isEmail,
  isPhone,
  isURL,
  isCreditCard,
  isJSON,
  isAlpha,
  isAlphanumeric,
  isHexColor,
  isIPv4,
  isIPv6,
  validatePasswordStrength,
  isInRange,
  matchesPattern
} from '../../src/core/validation';

describe('Validation utilities', () => {
  describe('isEmail', () => {
    it('should validate correct emails', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co.uk')).toBe(true);
      expect(isEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('test..test@example.com')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isEmail('  test@example.com  ')).toBe(true);
    });
  });

  describe('isPhone', () => {
    it('should validate phone numbers', () => {
      expect(isPhone('1234567890')).toBe(true);
      expect(isPhone('+1234567890')).toBe(true);
      expect(isPhone('123-456-7890')).toBe(true);
      expect(isPhone('(123) 456-7890')).toBe(true);
      expect(isPhone('123.456.7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isPhone('abc')).toBe(false);
      expect(isPhone('123')).toBe(false);
      expect(isPhone('')).toBe(false);
    });
  });

  describe('isURL', () => {
    it('should validate URLs', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://www.example.com')).toBe(true);
      expect(isURL('https://example.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isURL('not-a-url')).toBe(false);
      expect(isURL('ftp://example.com')).toBe(false);
      expect(isURL('example.com')).toBe(false);
    });
  });

  describe('isCreditCard', () => {
    it('should validate credit card numbers (Luhn algorithm)', () => {
      expect(isCreditCard('4532015112830366')).toBe(true); // Visa test number
      expect(isCreditCard('5555555555554444')).toBe(true); // MasterCard test number
    });

    it('should reject invalid credit card numbers', () => {
      expect(isCreditCard('1234567890123456')).toBe(false);
      expect(isCreditCard('abc')).toBe(false);
      expect(isCreditCard('123')).toBe(false);
    });

    it('should handle spaces in card numbers', () => {
      expect(isCreditCard('4532 0151 1283 0366')).toBe(true);
    });
  });

  describe('isJSON', () => {
    it('should validate JSON strings', () => {
      expect(isJSON('{"key": "value"}')).toBe(true);
      expect(isJSON('[1, 2, 3]')).toBe(true);
      expect(isJSON('null')).toBe(true);
      expect(isJSON('true')).toBe(true);
      expect(isJSON('123')).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(isJSON('invalid')).toBe(false);
      expect(isJSON('{key: value}')).toBe(false);
      expect(isJSON("{'key': 'value'}")).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('should validate alphabetic strings', () => {
      expect(isAlpha('abc')).toBe(true);
      expect(isAlpha('ABC')).toBe(true);
      expect(isAlpha('AbC')).toBe(true);
    });

    it('should reject non-alphabetic strings', () => {
      expect(isAlpha('abc123')).toBe(false);
      expect(isAlpha('abc-def')).toBe(false);
      expect(isAlpha('abc def')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('abc')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('abc@123')).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('should validate hex colors', () => {
      expect(isHexColor('#ff0000')).toBe(true);
      expect(isHexColor('#000')).toBe(true);
      expect(isHexColor('#FFFFFF')).toBe(true);
      expect(isHexColor('#abc123')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isHexColor('ff0000')).toBe(false);
      expect(isHexColor('#gg0000')).toBe(false);
      expect(isHexColor('#ff00')).toBe(false);
      expect(isHexColor('#ff00000')).toBe(false);
    });
  });

  describe('isIPv4', () => {
    it('should validate IPv4 addresses', () => {
      expect(isIPv4('192.168.1.1')).toBe(true);
      expect(isIPv4('0.0.0.0')).toBe(true);
      expect(isIPv4('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(isIPv4('256.1.1.1')).toBe(false);
      expect(isIPv4('192.168.1')).toBe(false);
      expect(isIPv4('192.168.1.1.1')).toBe(false);
      expect(isIPv4('abc.def.ghi.jkl')).toBe(false);
    });
  });

  describe('isIPv6', () => {
    it('should validate IPv6 addresses', () => {
      expect(isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isIPv6('2001:db8:85a3::8a2e:370:7334')).toBe(true);
      expect(isIPv6('::1')).toBe(true);
      expect(isIPv6('::')).toBe(true);
    });

    it('should reject invalid IPv6 addresses', () => {
      expect(isIPv6('192.168.1.1')).toBe(false);
      expect(isIPv6('gggg::1')).toBe(false);
      expect(isIPv6('2001:db8::8a2e::7334')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should provide feedback for weak passwords', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.score).toBeLessThan(4);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should check minimum length', () => {
      const result = validatePasswordStrength('Aa1!', 10);
      expect(result.feedback).toContain('Password must be at least 10 characters long');
    });
  });

  describe('isInRange', () => {
    it('should validate numbers in range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it('should reject numbers outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });

  describe('matchesPattern', () => {
    it('should validate strings against patterns', () => {
      expect(matchesPattern('abc123', /^[a-z]+\d+$/)).toBe(true);
      expect(matchesPattern('test@example.com', /\S+@\S+\.\S+/)).toBe(true);
    });

    it('should reject strings that do not match pattern', () => {
      expect(matchesPattern('123abc', /^[a-z]+\d+$/)).toBe(false);
      expect(matchesPattern('invalid-email', /\S+@\S+\.\S+/)).toBe(false);
    });
  });
});
