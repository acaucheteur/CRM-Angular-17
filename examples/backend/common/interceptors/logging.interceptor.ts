// Example: Logging Interceptor for NestJS Backend
// Path: backend/src/common/interceptors/logging.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = request.user?.id || 'anonymous';
    const startTime = Date.now();

    this.logger.log('Incoming request', {
      method,
      url,
      ip,
      userAgent,
      userId,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.log('Request completed', {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            userId,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logger.error('Request failed', {
            method,
            url,
            error: error.message,
            duration: `${duration}ms`,
            userId,
          });
        },
      }),
    );
  }
}
