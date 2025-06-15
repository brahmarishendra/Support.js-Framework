/**
 * Performance optimization utilities
 */

/**
 * Debounce function - delays execution until after delay has passed since last call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function - limits execution to once per limit period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoize function - caches results for same inputs
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Lazy function - executes function only when result is needed
 */
export function lazy<T>(func: () => T): () => T {
  let cached = false;
  let result: T;
  
  return () => {
    if (!cached) {
      result = func();
      cached = true;
    }
    return result;
  };
}

/**
 * RAF (RequestAnimationFrame) throttle for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let requestId: number;
  
  return (...args: Parameters<T>) => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
    
    requestId = requestAnimationFrame(() => {
      func(...args);
    });
  };
}

/**
 * Batch multiple function calls into a single execution
 */
export function batch<T extends (...args: any[]) => any>(
  func: T,
  batchSize = 10,
  delay = 0
): (...args: Parameters<T>) => void {
  const queue: Parameters<T>[] = [];
  let timeoutId: ReturnType<typeof setTimeout>;
  
  const processBatch = () => {
    if (queue.length > 0) {
      const batch = queue.splice(0, batchSize);
      batch.forEach(args => func(...args));
      
      if (queue.length > 0) {
        timeoutId = setTimeout(processBatch, delay);
      }
    }
  };
  
  return (...args: Parameters<T>) => {
    queue.push(args);
    
    if (!timeoutId) {
      timeoutId = setTimeout(processBatch, delay);
    }
  };
}

/**
 * Create a simple performance timer
 */
export class Timer {
  private startTime: number;
  private endTime: number | null = null;
  
  constructor() {
    this.startTime = performance.now();
  }
  
  /**
   * Stop the timer and return elapsed time in milliseconds
   */
  stop(): number {
    this.endTime = performance.now();
    return this.getElapsed();
  }
  
  /**
   * Get elapsed time without stopping the timer
   */
  getElapsed(): number {
    const end = this.endTime || performance.now();
    return end - this.startTime;
  }
  
  /**
   * Reset the timer
   */
  reset(): void {
    this.startTime = performance.now();
    this.endTime = null;
  }
}

/**
 * Measure function execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T {
  return ((...args: Parameters<T>) => {
    const timer = new Timer();
    const result = func(...args);
    const elapsed = timer.stop();
    
    if (label) {
      console.log(`${label}: ${elapsed.toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

/**
 * Simple FPS counter
 */
export class FPSCounter {
  private frames = 0;
  private lastTime = performance.now();
  private fps = 0;
  
  /**
   * Update FPS counter (call this in your animation loop)
   */
  update(): number {
    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }
  
  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }
}

/**
 * Queue for managing async operations
 */
export class AsyncQueue {
  private queue: (() => Promise<any>)[] = [];
  private running = false;
  private concurrency: number;
  private activeCount = 0;
  
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
  }
  
  /**
   * Add async function to queue
   */
  add<T>(asyncFunc: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await asyncFunc();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  /**
   * Process queue
   */
  private async process(): Promise<void> {
    if (this.running && this.activeCount >= this.concurrency) {
      return;
    }
    
    if (this.queue.length === 0) {
      this.running = false;
      return;
    }
    
    this.running = true;
    this.activeCount++;
    
    const task = this.queue.shift()!;
    
    try {
      await task();
    } finally {
      this.activeCount--;
      this.process();
    }
  }
  
  /**
   * Clear queue
   */
  clear(): void {
    this.queue.length = 0;
  }
  
  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }
}
