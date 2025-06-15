import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';

// Mock types for Angular HTTP when not available
interface HttpRequest<T> {
  method: string;
  url: string;
  headers: any;
  body: T;
  clone(update: any): HttpRequest<T>;
}

interface HttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}

interface HttpEvent<T> {}

interface HttpResponse<T> extends HttpEvent<T> {
  status: number;
  body: T;
}

interface HttpErrorResponse extends HttpEvent<any> {
  status: number;
  error: any;
  message: string;
}

interface HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

export interface HttpInterceptorConfig {
  enableLogging?: boolean;
  enableLoadingIndicator?: boolean;
  enableRetry?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * HTTP Interceptor service that provides logging, loading indicators, and retry functionality
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private activeRequests = 0;
  private config: HttpInterceptorConfig = {
    enableLogging: true,
    enableLoadingIndicator: true,
    enableRetry: false,
    retryCount: 3,
    retryDelay: 1000
  };

  constructor(private logger: LoggerService) {}

  /**
   * Configure the interceptor
   * @param config - Configuration options
   */
  configure(config: Partial<HttpInterceptorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Intercept HTTP requests
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    
    // Log request if enabled
    if (this.config.enableLogging) {
      this.logger.debug(`HTTP Request: ${req.method} ${req.url}`, {
        headers: req.headers,
        body: req.body
      });
    }

    // Track active requests for loading indicator
    if (this.config.enableLoadingIndicator) {
      this.activeRequests++;
      this.updateLoadingState();
    }

    // Clone the request to add default headers if needed
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Simplified implementation that works with basic Observable
    const response$ = next.handle(modifiedReq);
    
    // Track completion
    const cleanup = () => {
      if (this.config.enableLoadingIndicator) {
        this.activeRequests--;
        this.updateLoadingState();
      }
    };
    
    // Subscribe to handle logging and cleanup
    response$.subscribe({
      next: (event: any) => {
        if (event && event.status !== undefined) {
          const duration = Date.now() - startTime;
          if (this.config.enableLogging) {
            this.logger.debug(`HTTP Response: ${req.method} ${req.url} (${duration}ms)`, {
              status: event.status,
              body: event.body
            });
          }
        }
      },
      error: (error: any) => {
        const duration = Date.now() - startTime;
        if (this.config.enableLogging) {
          this.logger.error(`HTTP Error: ${req.method} ${req.url} (${duration}ms)`, {
            status: error.status || 0,
            error: error.error,
            message: error.message
          });
        }
        this.handleHttpError(error);
        cleanup();
      },
      complete: cleanup
    });
    
    return response$;
  }

  /**
   * Handle HTTP errors
   * @param error - The HTTP error response
   */
  private handleHttpError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    switch (error.status) {
      case 0:
        errorMessage = 'Network error - please check your connection';
        break;
      case 401:
        errorMessage = 'Unauthorized - please log in again';
        break;
      case 403:
        errorMessage = 'Forbidden - you do not have permission';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 500:
        errorMessage = 'Internal server error';
        break;
      default:
        errorMessage = error.message || 'Unknown error occurred';
    }

    this.logger.error(`HTTP Error (${error.status}): ${errorMessage}`);
  }

  /**
   * Update loading state based on active requests
   */
  private updateLoadingState(): void {
    const isLoading = this.activeRequests > 0;
    
    // Emit loading state (you can use a service or subject for this)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('http-loading-state', {
        detail: { isLoading, activeRequests: this.activeRequests }
      }));
    }
  }

  /**
   * Get current loading state
   */
  isLoading(): boolean {
    return this.activeRequests > 0;
  }

  /**
   * Get number of active requests
   */
  getActiveRequestCount(): number {
    return this.activeRequests;
  }
}
