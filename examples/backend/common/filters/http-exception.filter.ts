// Example: HTTP Exception Filter for NestJS Backend
// Path: backend/src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = uuidv4();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur interne est survenue';
    let error = 'Internal Server Error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
        details = (exceptionResponse as any).details;
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Logging with structured data
    this.logger.error('Exception caught', {
      correlationId,
      status,
      error,
      message,
      path: request.url,
      method: request.method,
      userAgent: request.get('user-agent'),
      ip: request.ip,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // User-friendly error response
    const errorResponse = {
      statusCode: status,
      message: this.getUserFriendlyMessage(status, message),
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private getUserFriendlyMessage(status: number, originalMessage: string): string {
    const friendlyMessages: Record<number, string> = {
      400: 'Les données fournies sont invalides. Veuillez vérifier votre saisie.',
      401: 'Vous devez être connecté pour accéder à cette ressource.',
      403: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
      404: "La ressource demandée n'a pas été trouvée.",
      409: 'Cette opération est en conflit avec les données existantes.',
      422: 'Les données ne peuvent pas être traitées. Veuillez vérifier votre saisie.',
      429: 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
      500: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
      503: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
    };

    return friendlyMessages[status] || originalMessage;
  }
}
