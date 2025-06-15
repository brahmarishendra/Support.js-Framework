import {
  unique,
  groupBy,
  flatten,
  chunk,
  intersection,
  difference,
  union,
  shuffle,
  sample,
  sortBy,
  partition,
  mode,
  zip
} from '../../src/core/array';

describe('Array utilities', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('groupBy', () => {
    const users = [
      { name: 'Alice', age: 25, department: 'Engineering' },
      { name: 'Bob', age: 30, department: 'Engineering' },
      { name: 'Charlie', age: 25, department: 'Marketing' }
    ];

    it('should group by property', () => {
      const result = groupBy(users, 'department');
      expect(result.Engineering).toHaveLength(2);
      expect(result.Marketing).toHaveLength(1);
    });

    it('should group by function', () => {
      const result = groupBy(users, user => user.age.toString());
      expect(result['25']).toHaveLength(2);
      expect(result['30']).toHaveLength(1);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([1, [2, 3], [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle already flat array', () => {
      expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      expect(flatten([])).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('should handle size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('intersection', () => {
    it('should find common elements', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
      expect(intersection(['a', 'b'], ['b', 'c'])).toEqual(['b']);
    });

    it('should handle no intersection', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should find elements in first array not in second', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
      expect(difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
    });
  });

  describe('union', () => {
    it('should combine arrays without duplicates', () => {
      expect(union([1, 2], [2, 3])).toEqual([1, 2, 3]);
      expect(union(['a'], ['a', 'b'])).toEqual(['a', 'b']);
    });
  });

  describe('shuffle', () => {
    it('should return array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled).toHaveLength(arr.length);
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3];
      const shuffled = shuffle(arr);
      expect(arr).toEqual([1, 2, 3]);
      expect(shuffled).not.toBe(arr);
    });
  });

  describe('sample', () => {
    it('should return specified number of elements', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(sample(arr, 2)).toHaveLength(2);
      expect(sample(arr, 1)).toHaveLength(1);
    });

    it('should handle count larger than array', () => {
      const arr = [1, 2];
      expect(sample(arr, 5)).toHaveLength(2);
    });
  });

  describe('sortBy', () => {
    const users = [
      { name: 'Charlie', age: 25 },
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];

    it('should sort by single criterion', () => {
      const sorted = sortBy(users, user => user.name);
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('Bob');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('should sort by multiple criteria', () => {
      const sorted = sortBy(users, user => user.age, user => user.name);
      expect(sorted[0].name).toBe('Bob'); // age 25, name Bob
      expect(sorted[1].name).toBe('Charlie'); // age 25, name Charlie
      expect(sorted[2].name).toBe('Alice'); // age 30, name Alice
    });
  });

  describe('partition', () => {
    it('should split array based on predicate', () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });
  });

  describe('mode', () => {
    it('should find most frequent element', () => {
      expect(mode([1, 2, 2, 3])).toBe(2);
      expect(mode(['a', 'b', 'a', 'c', 'a'])).toBe('a');
    });

    it('should return null for empty array', () => {
      expect(mode([])).toBe(null);
    });
  });

  describe('zip', () => {
    it('should zip arrays together', () => {
      expect(zip([1, 2], ['a', 'b'], [true, false])).toEqual([
        [1, 'a', true],
        [2, 'b', false]
      ]);
    });

    it('should handle arrays of different lengths', () => {
      expect(zip([1, 2, 3], ['a'])).toEqual([[1, 'a']]);
    });
  });
});
