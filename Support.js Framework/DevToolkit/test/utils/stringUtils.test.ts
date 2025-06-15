import {
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  capitalize,
  truncate,
  cleanWhitespace,
  isValidEmail,
  randomString,
  pluralize,
  escapeHtml
} from '../../src/utils/stringUtils';

describe('stringUtils', () => {
  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should convert space separated to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('should convert spaces to kebab-case', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert spaces to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should lowercase other letters', () => {
      expect(capitalize('hELLO')).toBe('Hello');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello world', 8)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello world', 8, '---')).toBe('Hello---');
    });
  });

  describe('cleanWhitespace', () => {
    it('should clean extra whitespace', () => {
      expect(cleanWhitespace('  hello   world  ')).toBe('hello world');
    });

    it('should handle tabs and newlines', () => {
      expect(cleanWhitespace('hello\t\nworld')).toBe('hello world');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('randomString', () => {
    it('should generate string of correct length', () => {
      const result = randomString(10);
      expect(result).toHaveLength(10);
    });

    it('should use custom charset', () => {
      const result = randomString(5, 'ABC');
      expect(result).toMatch(/^[ABC]+$/);
    });
  });

  describe('pluralize', () => {
    it('should not pluralize singular', () => {
      expect(pluralize('cat', 1)).toBe('cat');
    });

    it('should pluralize regular words', () => {
      expect(pluralize('cat', 2)).toBe('cats');
    });

    it('should handle words ending in y', () => {
      expect(pluralize('city', 2)).toBe('cities');
    });

    it('should use custom plural form', () => {
      expect(pluralize('person', 2, 'people')).toBe('people');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML characters', () => {
      expect(escapeHtml('<div>Hello & "world"</div>')).toBe(
        '&lt;div&gt;Hello &amp; &quot;world&quot;&lt;/div&gt;'
      );
    });

    it('should handle single quotes', () => {
      expect(escapeHtml("It's a test")).toBe("It&#39;s a test");
    });
  });
});
