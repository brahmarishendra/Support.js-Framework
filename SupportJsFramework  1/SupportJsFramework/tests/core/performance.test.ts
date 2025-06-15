import {
  debounce,
  throttle,
  memoize,
  lazy,
  rafThrottle,
  batch,
  Timer,
  measurePerformance,
  FPSCounter,
  AsyncQueue
} from '../../src/core/performance';

describe('Performance utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset delay on repeated calls', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn(); // Reset delay
      jest.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    it('should limit function execution', () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      throttledFn();
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments correctly', () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(fn);

      expect(memoizedFn(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoizedFn(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1); // Should not call again

      expect(memoizedFn(10)).toBe(20);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should work with custom key generator', () => {
      const fn = jest.fn((obj: { id: number; data: string }) => obj.data.toUpperCase());
      const memoizedFn = memoize(fn, (obj) => obj.id.toString());

      const obj1 = { id: 1, data: 'hello' };
      const obj2 = { id: 1, data: 'world' }; // Same ID, different data

      expect(memoizedFn(obj1)).toBe('HELLO');
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoizedFn(obj2)).toBe('HELLO'); // Should return cached value
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('lazy', () => {
    it('should execute function only once', () => {
      const fn = jest.fn(() => 'computed value');
      const lazyFn = lazy(fn);

      expect(lazyFn()).toBe('computed value');
      expect(fn).toHaveBeenCalledTimes(1);

      expect(lazyFn()).toBe('computed value');
      expect(fn).toHaveBeenCalledTimes(1); // Should not call again
    });
  });

  describe('rafThrottle', () => {
    it('should throttle using requestAnimationFrame', () => {
      const fn = jest.fn();
      const rafThrottledFn = rafThrottle(fn);

      rafThrottledFn();
      rafThrottledFn();
      rafThrottledFn();

      expect(fn).not.toHaveBeenCalled();

      // Simulate RAF callback
      const rafCallback = (global.requestAnimationFrame as jest.Mock).mock.calls[0][0];
      rafCallback();

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('batch', () => {
    it('should batch function calls', () => {
      const fn = jest.fn();
      const batchedFn = batch(fn, 2, 0);

      batchedFn('arg1');
      batchedFn('arg2');
      batchedFn('arg3');

      jest.advanceTimersByTime(1);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, 'arg1');
      expect(fn).toHaveBeenNthCalledWith(2, 'arg2');

      jest.advanceTimersByTime(1);

      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(3, 'arg3');
    });
  });

  describe('Timer', () => {
    beforeEach(() => {
      jest.useRealTimers();
      // Mock performance.now
      jest.spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1500);
    });

    it('should measure elapsed time', () => {
      const timer = new Timer();
      const elapsed = timer.stop();

      expect(elapsed).toBe(500);
    });

    it('should get elapsed time without stopping', () => {
      const timer = new Timer();
      const elapsed = timer.getElapsed();

      expect(elapsed).toBe(500);
    });

    it('should reset timer', () => {
      const timer = new Timer();
      timer.stop();
      
      jest.spyOn(performance, 'now').mockReturnValue(2000);
      timer.reset();
      
      expect(timer.getElapsed()).toBe(0);
    });
  });

  describe('measurePerformance', () => {
    beforeEach(() => {
      jest.useRealTimers();
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1100);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should measure function performance', () => {
      const fn = jest.fn(() => 'result');
      const measuredFn = measurePerformance(fn, 'test function');

      const result = measuredFn();

      expect(result).toBe('result');
      expect(console.log).toHaveBeenCalledWith('test function: 100.00ms');
    });
  });

  describe('FPSCounter', () => {
    beforeEach(() => {
      jest.useRealTimers();
      jest.spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(2000);
    });

    it('should calculate FPS', () => {
      const fpsCounter = new FPSCounter();
      
      // Simulate 60 frames in 1 second
      for (let i = 0; i < 60; i++) {
        fpsCounter.update();
      }

      expect(fpsCounter.getFPS()).toBe(60);
    });
  });

  describe('AsyncQueue', () => {
    it('should process async operations sequentially', async () => {
      const queue = new AsyncQueue(1);
      const results: number[] = [];

      const task1 = () => new Promise<number>(resolve => {
        setTimeout(() => {
          results.push(1);
          resolve(1);
        }, 10);
      });

      const task2 = () => new Promise<number>(resolve => {
        setTimeout(() => {
          results.push(2);
          resolve(2);
        }, 5);
      });

      const promise1 = queue.add(task1);
      const promise2 = queue.add(task2);

      await Promise.all([promise1, promise2]);

      expect(results).toEqual([1, 2]); // Should execute in order
    });

    it('should handle concurrent operations', async () => {
      const queue = new AsyncQueue(2);
      const startTimes: number[] = [];

      const createTask = (id: number) => () => new Promise<number>(resolve => {
        startTimes.push(Date.now());
        setTimeout(() => resolve(id), 10);
      });

      const promises = [1, 2, 3, 4].map(id => queue.add(createTask(id)));
      await Promise.all(promises);

      // First two tasks should start almost simultaneously
      expect(startTimes[1] - startTimes[0]).toBeLessThan(5);
    });

    it('should clear queue', () => {
      const queue = new AsyncQueue();
      queue.add(() => Promise.resolve(1));
      queue.add(() => Promise.resolve(2));

      expect(queue.size()).toBe(2);
      queue.clear();
      expect(queue.size()).toBe(0);
    });
  });
});
