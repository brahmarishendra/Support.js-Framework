// Export Angular services
export { LoggerService, LogLevel } from './services/logger.service';
export type { LogEntry } from './services/logger.service';

export { HttpInterceptorService } from './services/http-interceptor.service';
export type { HttpInterceptorConfig } from './services/http-interceptor.service';

// Angular module for easy integration
// Note: Import NgModule and HTTP_INTERCEPTORS from respective Angular packages when available
import { LoggerService } from './services/logger.service';

export class SupportJsModule {
  static forRoot() {
    return {
      ngModule: SupportJsModule,
      providers: [
        { provide: 'LoggerService', useClass: LoggerService }
      ]
    };
  }
}
