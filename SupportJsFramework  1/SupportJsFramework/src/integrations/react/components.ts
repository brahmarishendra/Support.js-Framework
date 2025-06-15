/**
 * React components for support-js-framework
 */

import React, { useState, useEffect, useRef } from 'react';
import { debounce } from '../../core/performance';
import { formatDate } from '../../core/date';
import { formatCurrency } from '../../core/number';

/**
 * Props for LazyImage component
 */
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Lazy loading image component
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholder,
  threshold = 0.1,
  rootMargin = '0px',
  alt = '',
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && imageSrc !== src) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold, rootMargin }
      );
      
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, src, threshold, rootMargin]);

  return React.createElement('img', {
    ref: setImageRef,
    src: imageSrc,
    alt,
    className,
    ...props
  });
};

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error boundary component
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return React.createElement(this.props.fallback, {
          error: this.state.error,
          resetError: this.resetError
        });
      }

      return React.createElement('div', {
        style: {
          padding: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '4px',
          backgroundColor: '#ffe0e0',
          color: '#d63031'
        }
      }, [
        React.createElement('h3', { key: 'title' }, 'Something went wrong'),
        React.createElement('p', { key: 'message' }, this.state.error.message),
        React.createElement('button', {
          key: 'reset',
          onClick: this.resetError,
          style: {
            padding: '8px 16px',
            backgroundColor: '#d63031',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Try again')
      ]);
    }

    return this.props.children;
  }
}

/**
 * Props for DateDisplay component
 */
export interface DateDisplayProps {
  date: Date;
  format?: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD HH:mm:ss' | 'MMM DD, YYYY' | 'MMMM DD, YYYY';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Date display component with formatting
 */
export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  format = 'MMM DD, YYYY',
  className = '',
  style = {}
}) => {
  const formattedDate = formatDate(date, format);
  
  return React.createElement('span', {
    className,
    style,
    title: date.toISOString()
  }, formattedDate);
};

/**
 * Props for CurrencyDisplay component
 */
export interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Currency display component with formatting
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = 'USD',
  locale = 'en-US',
  className = '',
  style = {}
}) => {
  const formattedAmount = formatCurrency(amount, { currency, locale });
  
  return React.createElement('span', {
    className,
    style
  }, formattedAmount);
};

/**
 * Props for DebounceInput component
 */
export interface DebounceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onDebouncedChange: (value: string) => void;
  debounceMs?: number;
}

/**
 * Debounced input component
 */
export const DebounceInput: React.FC<DebounceInputProps> = ({
  onDebouncedChange,
  debounceMs = 300,
  ...props
}) => {
  const [value, setValue] = useState(props.value || '');
  const debouncedCallback = useRef(debounce(onDebouncedChange, debounceMs));

  useEffect(() => {
    debouncedCallback.current = debounce(onDebouncedChange, debounceMs);
  }, [onDebouncedChange, debounceMs]);

  useEffect(() => {
    if (typeof value === 'string') {
      debouncedCallback.current(value);
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return React.createElement('input', {
    ...props,
    value,
    onChange: handleChange
  });
};

/**
 * Props for Portal component
 */
export interface PortalProps {
  children: React.ReactNode;
  container?: Element;
}

/**
 * Portal component for rendering outside component tree
 */
export const Portal: React.FC<PortalProps> = ({
  children,
  container = typeof document !== 'undefined' ? document.body : null
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !container) {
    return null;
  }

  return React.createPortal ? React.createPortal(children, container) : null;
};

/**
 * Props for If component
 */
export interface IfProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditional rendering component
 */
export const If: React.FC<IfProps> = ({ condition, children, fallback = null }) => {
  return condition ? (children as React.ReactElement) : (fallback as React.ReactElement);
};

/**
 * Props for Show component
 */
export interface ShowProps {
  when: boolean;
  children: React.ReactNode;
}

/**
 * Show component for conditional rendering
 */
export const Show: React.FC<ShowProps> = ({ when, children }) => {
  return when ? (children as React.ReactElement) : null;
};

/**
 * Props for For component
 */
export interface ForProps<T> {
  each: T[];
  children: (item: T, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * For loop component
 */
export function For<T>({ each, children, fallback }: ForProps<T>): React.ReactElement {
  if (each.length === 0 && fallback) {
    return fallback as React.ReactElement;
  }

  return React.createElement(React.Fragment, null, each.map(children));
}

// Helper function to use createPortal safely
const createPortal = (
  typeof React !== 'undefined' && 'createPortal' in React
) ? (React as any).createPortal : null;

// Update Portal component to use the helper
if (createPortal) {
  Object.defineProperty(React, 'createPortal', {
    value: createPortal,
    writable: false
  });
}
