import { LocalStorage, SessionStorage, CookieStorage, Storage } from '../../src/core/storage';

// Mock localStorage and sessionStorage
const createStorageMock = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null)
  };
};

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('Storage utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    sessionStorageMock.clear();
    document.cookie = '';
  });

  describe('LocalStorage', () => {
    describe('set and get', () => {
      it('should store and retrieve primitive values', () => {
        expect(LocalStorage.set('string', 'hello')).toBe(true);
        expect(LocalStorage.get('string')).toBe('hello');

        expect(LocalStorage.set('number', 42)).toBe(true);
        expect(LocalStorage.get('number')).toBe(42);

        expect(LocalStorage.set('boolean', true)).toBe(true);
        expect(LocalStorage.get('boolean')).toBe(true);
      });

      it('should store and retrieve objects', () => {
        const obj = { name: 'John', age: 30 };
        expect(LocalStorage.set('object', obj)).toBe(true);
        expect(LocalStorage.get('object')).toEqual(obj);
      });

      it('should store and retrieve arrays', () => {
        const arr = [1, 2, 3, 'test'];
        expect(LocalStorage.set('array', arr)).toBe(true);
        expect(LocalStorage.get('array')).toEqual(arr);
      });

      it('should return null for non-existent keys', () => {
        expect(LocalStorage.get('nonexistent')).toBe(null);
      });
    });

    describe('getWithDefault', () => {
      it('should return stored value', () => {
        LocalStorage.set('test', 'value');
        expect(LocalStorage.getWithDefault('test', 'default')).toBe('value');
      });

      it('should return default for non-existent key', () => {
        expect(LocalStorage.getWithDefault('nonexistent', 'default')).toBe('default');
      });
    });

    describe('remove', () => {
      it('should remove stored item', () => {
        LocalStorage.set('test', 'value');
        expect(LocalStorage.get('test')).toBe('value');
        
        expect(LocalStorage.remove('test')).toBe(true);
        expect(LocalStorage.get('test')).toBe(null);
      });
    });

    describe('clear', () => {
      it('should clear all items', () => {
        LocalStorage.set('test1', 'value1');
        LocalStorage.set('test2', 'value2');
        
        expect(LocalStorage.clear()).toBe(true);
        expect(LocalStorage.get('test1')).toBe(null);
        expect(LocalStorage.get('test2')).toBe(null);
      });
    });

    describe('isAvailable', () => {
      it('should return true when localStorage is available', () => {
        expect(LocalStorage.isAvailable()).toBe(true);
      });
    });

    describe('getKeys', () => {
      it('should return all keys', () => {
        LocalStorage.set('key1', 'value1');
        LocalStorage.set('key2', 'value2');
        
        const keys = LocalStorage.getKeys();
        expect(keys).toContain('key1');
        expect(keys).toContain('key2');
      });
    });
  });

  describe('SessionStorage', () => {
    it('should work similarly to LocalStorage', () => {
      expect(SessionStorage.set('test', 'value')).toBe(true);
      expect(SessionStorage.get('test')).toBe('value');
      expect(SessionStorage.remove('test')).toBe(true);
      expect(SessionStorage.get('test')).toBe(null);
    });
  });

  describe('CookieStorage', () => {
    beforeEach(() => {
      // Mock document.cookie
      let cookies: string[] = [];
      Object.defineProperty(document, 'cookie', {
        get: () => cookies.join('; '),
        set: (value: string) => {
          const [cookieString] = value.split(';');
          const existingIndex = cookies.findIndex(c => 
            c.split('=')[0] === cookieString.split('=')[0]
          );
          if (existingIndex >= 0) {
            cookies[existingIndex] = cookieString;
          } else {
            cookies.push(cookieString);
          }
        },
        configurable: true
      });
    });

    describe('set and get', () => {
      it('should set and get cookies', () => {
        CookieStorage.set('test', 'value');
        expect(CookieStorage.get('test')).toBe('value');
      });

      it('should handle special characters', () => {
        CookieStorage.set('test', 'hello world');
        expect(CookieStorage.get('test')).toBe('hello world');
      });

      it('should return null for non-existent cookies', () => {
        expect(CookieStorage.get('nonexistent')).toBe(null);
      });
    });

    describe('has', () => {
      it('should check cookie existence', () => {
        CookieStorage.set('test', 'value');
        expect(CookieStorage.has('test')).toBe(true);
        expect(CookieStorage.has('nonexistent')).toBe(false);
      });
    });

    describe('getAll', () => {
      it('should return all cookies', () => {
        CookieStorage.set('cookie1', 'value1');
        CookieStorage.set('cookie2', 'value2');
        
        const all = CookieStorage.getAll();
        expect(all.cookie1).toBe('value1');
        expect(all.cookie2).toBe('value2');
      });
    });
  });

  describe('Storage (unified interface)', () => {
    it('should use localStorage by default', () => {
      expect(Storage.set('test', 'value')).toBe(true);
      expect(Storage.get('test')).toBe('value');
    });

    it('should prefer sessionStorage when requested', () => {
      expect(Storage.set('test', 'value', true)).toBe(true);
      expect(Storage.get('test', true)).toBe('value');
    });

    it('should remove from all storage types', () => {
      LocalStorage.set('test', 'value');
      SessionStorage.set('test', 'value');
      CookieStorage.set('test', 'value');
      
      Storage.remove('test');
      
      expect(LocalStorage.get('test')).toBe(null);
      expect(SessionStorage.get('test')).toBe(null);
      expect(CookieStorage.get('test')).toBe(null);
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(LocalStorage.set('test', 'value')).toBe(false);
    });

    it('should handle JSON parsing errors', () => {
      // Mock invalid JSON
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      expect(LocalStorage.get('test')).toBe(null);
    });
  });
});
