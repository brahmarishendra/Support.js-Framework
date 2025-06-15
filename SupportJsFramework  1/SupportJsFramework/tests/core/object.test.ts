import {
  deepClone,
  merge,
  pick,
  omit,
  deepEqual,
  get,
  set,
  has,
  flatten,
  toQueryString
} from '../../src/core/object';

describe('Object utilities', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone dates', () => {
      const date = new Date();
      const cloned = deepClone(date);
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });
  });

  describe('merge', () => {
    it('should merge simple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = merge(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const obj1 = { a: { x: 1, y: 2 } };
      const obj2 = { a: { y: 3, z: 4 } };
      const result = merge(obj1, obj2);
      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });

    it('should not modify original objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      merge(obj1, obj2);
      expect(obj1).toEqual({ a: 1 });
      expect(obj2).toEqual({ b: 2 });
    });
  });

  describe('pick', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    it('should pick specified keys', () => {
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle non-existent keys', () => {
      expect(pick(obj, ['a', 'x'] as any)).toEqual({ a: 1 });
    });

    it('should handle empty key array', () => {
      expect(pick(obj, [])).toEqual({});
    });
  });

  describe('omit', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    it('should omit specified keys', () => {
      expect(omit(obj, ['a', 'c'])).toEqual({ b: 2, d: 4 });
    });

    it('should handle non-existent keys', () => {
      expect(omit(obj, ['a', 'x'] as any)).toEqual({ b: 2, c: 3, d: 4 });
    });

    it('should handle empty key array', () => {
      expect(omit(obj, [])).toEqual(obj);
    });
  });

  describe('deepEqual', () => {
    it('should compare primitive values', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('a', 'a')).toBe(true);
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('a', 'b')).toBe(false);
    });

    it('should compare null and undefined', () => {
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    it('should compare arrays', () => {
      expect(deepEqual([1, 2], [1, 2])).toBe(true);
      expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
      expect(deepEqual([1, 2], [1, 3])).toBe(false);
      expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should compare objects', () => {
      expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(deepEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('should compare dates', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');
      expect(deepEqual(date1, date2)).toBe(true);
      expect(deepEqual(date1, date3)).toBe(false);
    });
  });

  describe('get', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      },
      d: null
    };

    it('should get nested values', () => {
      expect(get(obj, 'a.b.c')).toBe('value');
      expect(get(obj, 'a.b')).toEqual({ c: 'value' });
    });

    it('should return default for non-existent paths', () => {
      expect(get(obj, 'a.b.x', 'default')).toBe('default');
      expect(get(obj, 'x.y.z', 'default')).toBe('default');
    });

    it('should handle null values in path', () => {
      expect(get(obj, 'd.x', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should set nested values', () => {
      const obj = { a: { b: 1 } };
      const result = set(obj, 'a.b', 2);
      expect(result.a.b).toBe(2);
      expect(obj.a.b).toBe(1); // Original should not be modified
    });

    it('should create nested paths', () => {
      const obj = {};
      const result = set(obj, 'a.b.c', 'value');
      expect(result.a.b.c).toBe('value');
    });
  });

  describe('has', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      },
      d: null
    };

    it('should check for existing paths', () => {
      expect(has(obj, 'a.b.c')).toBe(true);
      expect(has(obj, 'a.b')).toBe(true);
      expect(has(obj, 'd')).toBe(true);
    });

    it('should return false for non-existent paths', () => {
      expect(has(obj, 'a.b.x')).toBe(false);
      expect(has(obj, 'x.y.z')).toBe(false);
    });
  });

  describe('flatten', () => {
    it('should flatten nested object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      };
      
      expect(flatten(obj)).toEqual({
        'a': 1,
        'b.c': 2,
        'b.d.e': 3
      });
    });

    it('should handle custom separator', () => {
      const obj = { a: { b: 1 } };
      expect(flatten(obj, '', '_')).toEqual({ 'a_b': 1 });
    });
  });

  describe('toQueryString', () => {
    it('should convert object to query string', () => {
      const obj = { a: 1, b: 'hello', c: true };
      const result = toQueryString(obj);
      expect(result).toContain('a=1');
      expect(result).toContain('b=hello');
      expect(result).toContain('c=true');
    });

    it('should skip null and undefined values', () => {
      const obj = { a: 1, b: null, c: undefined, d: 'test' };
      const result = toQueryString(obj);
      expect(result).toContain('a=1');
      expect(result).toContain('d=test');
      expect(result).not.toContain('b=');
      expect(result).not.toContain('c=');
    });
  });
});
