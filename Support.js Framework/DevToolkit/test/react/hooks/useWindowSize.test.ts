import { renderHook, act } from '@testing-library/react';
import { useWindowSize } from '../../../src/react/hooks/useWindowSize';

// Mock window object
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
};

// Replace window object
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: mockWindow.innerWidth
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: mockWindow.innerHeight
});

describe('useWindowSize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  it('should return initial window size', () => {
    const { result } = renderHook(() => useWindowSize());
    
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should add event listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    renderHook(() => useWindowSize());
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useWindowSize());
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should update size on window resize', () => {
    const { result } = renderHook(() => useWindowSize());
    
    // Simulate window resize
    act(() => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      window.dispatchEvent(new Event('resize'));
    });
    
    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
  });

  it('should handle SSR environment', () => {
    // Mock server environment
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    const { result } = renderHook(() => useWindowSize());
    
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    
    // Restore window
    global.window = originalWindow;
  });
});
