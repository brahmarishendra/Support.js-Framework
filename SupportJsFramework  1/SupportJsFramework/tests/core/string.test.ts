import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  truncate,
  normalizeWhitespace,
  isEmpty,
  randomString,
  escapeHtml,
  unescapeHtml,
  wordCount,
  getInitials,
  pluralize
} from '../../src/core/string';

describe('String utilities', () => {
  describe('capitalize', () => {
    it('should capitalize each word', () => {
      expect(capitalize('hello world')).toBe('Hello World');
      expect(capitalize('HELLO WORLD')).toBe('Hello World');
      expect(capitalize('hELLO wORLD')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('Hello World')).toBe('helloWorld');
      expect(camelCase('HELLO WORLD')).toBe('helloWorld');
    });

    it('should handle special characters', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('hello world')).toBe('hello-world');
      expect(kebabCase('Hello World')).toBe('hello-world');
      expect(kebabCase('helloWorld')).toBe('hello-world');
    });

    it('should handle underscores', () => {
      expect(kebabCase('hello_world')).toBe('hello-world');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('hello world')).toBe('hello_world');
      expect(snakeCase('Hello World')).toBe('hello_world');
      expect(snakeCase('helloWorld')).toBe('hello_world');
    });

    it('should handle hyphens', () => {
      expect(snakeCase('hello-world')).toBe('hello_world');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('hello-world')).toBe('HelloWorld');
      expect(pascalCase('hello_world')).toBe('HelloWorld');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('hello world', 5)).toBe('he...');
      expect(truncate('hello world', 8)).toBe('hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('hello world', 5, '---')).toBe('he---');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should normalize multiple spaces', () => {
      expect(normalizeWhitespace('hello    world')).toBe('hello world');
      expect(normalizeWhitespace('  hello  world  ')).toBe('hello world');
    });

    it('should handle tabs and newlines', () => {
      expect(normalizeWhitespace('hello\t\nworld')).toBe('hello world');
    });
  });

  describe('isEmpty', () => {
    it('should identify empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    it('should identify non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('randomString', () => {
    it('should generate string of correct length', () => {
      expect(randomString(10)).toHaveLength(10);
      expect(randomString(5)).toHaveLength(5);
    });

    it('should use custom character set', () => {
      const result = randomString(10, '123');
      expect(result).toMatch(/^[123]+$/);
    });
  });

  describe('escapeHtml', () => {
    beforeEach(() => {
      // Mock document.createElement for Node.js environment
      global.document = {
        createElement: jest.fn(() => ({
          textContent: '',
          innerHTML: ''
        }))
      } as any;
    });

    it('should escape HTML characters', () => {
      const mockDiv = {
        textContent: '',
        innerHTML: '&lt;script&gt;alert()&lt;/script&gt;'
      };
      
      (document.createElement as jest.Mock).mockReturnValue(mockDiv);
      
      const result = escapeHtml('<script>alert()</script>');
      expect(document.createElement).toHaveBeenCalledWith('div');
    });
  });

  describe('wordCount', () => {
    it('should count words correctly', () => {
      expect(wordCount('hello world')).toBe(2);
      expect(wordCount('hello    world   test')).toBe(3);
      expect(wordCount('')).toBe(0);
      expect(wordCount('   ')).toBe(0);
    });
  });

  describe('getInitials', () => {
    it('should extract initials', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John Michael Doe')).toBe('JM');
      expect(getInitials('John Michael Doe Smith', 3)).toBe('JMD');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });
  });

  describe('pluralize', () => {
    it('should pluralize correctly', () => {
      expect(pluralize('cat', 2)).toBe('cats');
      expect(pluralize('cat', 1)).toBe('cat');
      expect(pluralize('box', 2)).toBe('boxes');
      expect(pluralize('city', 2)).toBe('cities');
    });

    it('should use custom plural form', () => {
      expect(pluralize('person', 2, 'people')).toBe('people');
      expect(pluralize('person', 1, 'people')).toBe('person');
    });
  });
});
