# Gestion des Erreurs - AFPI CRM

Ce document décrit la stratégie de gestion des erreurs pour améliorer l'expérience utilisateur.

## 📋 Table des matières

- [Principes](#principes)
- [Backend (NestJS)](#backend-nestjs)
- [Frontend (Angular)](#frontend-angular)
- [Codes d'erreur](#codes-derreur)
- [Messages utilisateur](#messages-utilisateur)

---

## 🎯 Principes

### Objectifs

1. **Transparence** : Informer l'utilisateur de ce qui s'est passé
2. **Clarté** : Messages compréhensibles par des non-techniques
3. **Action** : Indiquer ce que l'utilisateur peut faire
4. **Traçabilité** : Logger pour le débogage sans exposer de détails techniques

### Format standard des erreurs

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  correlationId?: string; // Pour tracer les erreurs
  details?: any; // Informations supplémentaires
}
```

---

## 🔧 Backend (NestJS)

### Exception Filter global

```typescript
// src/common/filters/http-exception.filter.ts
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

    // Logging
    this.logger.error('Exception caught', {
      correlationId,
      status,
      error,
      message,
      path: request.url,
      method: request.method,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Response
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
    // Messages adaptés pour les utilisateurs non-techniques
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
```

### Validation Pipe

```typescript
// src/common/pipes/validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));

      throw new BadRequestException({
        message: 'Validation échouée',
        details: messages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

### Intercepteur pour les erreurs TypeORM

```typescript
// src/common/interceptors/typeorm-error.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class TypeOrmErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof QueryFailedError) {
          // Erreur de contrainte unique
          if ((error as any).code === 'ER_DUP_ENTRY') {
            const match = error.message.match(/for key '(.+?)'/);
            const field = match ? match[1].split('.').pop() : 'champ';

            return throwError(
              () =>
                new ConflictException({
                  message: `Cette valeur existe déjà pour le ${field}`,
                  details: { field, error: 'duplicate' },
                }),
            );
          }

          // Erreur de clé étrangère
          if ((error as any).code === 'ER_NO_REFERENCED_ROW_2') {
            return throwError(
              () =>
                new BadRequestException({
                  message: 'Référence invalide vers une ressource inexistante',
                  details: { error: 'invalid_reference' },
                }),
            );
          }

          // Autres erreurs SQL
          return throwError(
            () =>
              new InternalServerErrorException({
                message: 'Erreur lors de l\'accès à la base de données',
              }),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
```

### Application dans main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TypeOrmErrorInterceptor } from './common/interceptors/typeorm-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(new TypeOrmErrorInterceptor());

  await app.listen(3000);
}
bootstrap();
```

---

## 🎨 Frontend (Angular)

### HTTP Interceptor

```typescript
// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private logger: LoggerService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // Retry sur les erreurs réseau (sauf POST/PUT/DELETE)
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true,
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Log l'erreur
    this.logger.error('HTTP Error', error);

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      this.toastr.error(
        'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        'Erreur réseau',
      );
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 0:
          this.toastr.error('Le serveur ne répond pas', 'Erreur de connexion');
          break;

        case 400:
          this.handleValidationError(error);
          break;

        case 401:
          this.toastr.error('Votre session a expiré', 'Non authentifié');
          this.router.navigate(['/login']);
          break;

        case 403:
          this.toastr.error(
            "Vous n'avez pas les droits pour effectuer cette action",
            'Accès refusé',
          );
          break;

        case 404:
          this.toastr.error("La ressource demandée n'existe pas", 'Non trouvé');
          break;

        case 409:
          const message = error.error?.message || 'Conflit de données';
          this.toastr.error(message, 'Conflit');
          break;

        case 422:
          this.handleValidationError(error);
          break;

        case 429:
          this.toastr.warning(
            'Trop de requêtes. Veuillez patienter quelques instants.',
            'Limite atteinte',
          );
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          this.toastr.error(
            'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
            'Erreur serveur',
            { timeOut: 5000 },
          );
          break;

        default:
          this.toastr.error('Une erreur inattendue est survenue', 'Erreur');
      }
    }
  }

  private handleValidationError(error: HttpErrorResponse) {
    if (error.error?.details && Array.isArray(error.error.details)) {
      // Afficher les erreurs de validation
      error.error.details.forEach((detail: any) => {
        const fieldName = this.getFieldLabel(detail.field);
        const errorMsg = detail.errors?.join(', ') || 'Valeur invalide';
        this.toastr.error(`${fieldName}: ${errorMsg}`, 'Validation');
      });
    } else {
      const message = error.error?.message || 'Les données fournies sont invalides';
      this.toastr.error(message, 'Validation');
    }
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      email: 'Email',
      password: 'Mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      roleId: 'Rôle',
      localisationId: 'Localisation',
    };

    return labels[field] || field;
  }
}
```

### Error Handler Service

```typescript
// src/app/core/services/error-handler.service.ts
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface FormError {
  field: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}

  /**
   * Affiche une erreur générique
   */
  showError(message: string, title: string = 'Erreur') {
    this.toastr.error(message, title);
  }

  /**
   * Affiche un message de succès
   */
  showSuccess(message: string, title: string = 'Succès') {
    this.toastr.success(message, title);
  }

  /**
   * Affiche un avertissement
   */
  showWarning(message: string, title: string = 'Attention') {
    this.toastr.warning(message, title);
  }

  /**
   * Affiche une info
   */
  showInfo(message: string, title: string = 'Information') {
    this.toastr.info(message, title);
  }

  /**
   * Gère les erreurs de formulaire
   */
  handleFormErrors(errors: FormError[]): void {
    errors.forEach((error) => {
      this.toastr.error(error.message, error.field);
    });
  }

  /**
   * Parse les erreurs de validation du backend
   */
  parseValidationErrors(errorResponse: any): FormError[] {
    if (!errorResponse?.details) {
      return [];
    }

    return errorResponse.details.map((detail: any) => ({
      field: detail.field,
      message: detail.errors?.join(', ') || 'Valeur invalide',
    }));
  }
}
```

### Utilisation dans un composant

```typescript
// src/app/modules/users/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      roleId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      this.errorHandler.showError('Veuillez corriger les erreurs du formulaire');
      return;
    }

    this.loading = true;
    this.userService.createUser(this.userForm.value).subscribe({
      next: (user) => {
        this.errorHandler.showSuccess('Utilisateur créé avec succès');
        this.userForm.reset();
        this.loading = false;
      },
      error: (error) => {
        // L'interceptor gère déjà l'affichage de l'erreur
        this.loading = false;

        // Parser les erreurs de validation pour les afficher sur les champs
        const validationErrors = this.errorHandler.parseValidationErrors(error.error);
        this.handleFieldErrors(validationErrors);
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private handleFieldErrors(errors: any[]) {
    errors.forEach((error) => {
      const control = this.userForm.get(error.field);
      if (control) {
        control.setErrors({ serverError: error.message });
      }
    });
  }
}
```

---

## 📋 Codes d'erreur

### Codes HTTP standards

| Code | Signification | Message utilisateur |
|------|---------------|---------------------|
| 400 | Bad Request | Les données fournies sont invalides |
| 401 | Unauthorized | Vous devez être connecté |
| 403 | Forbidden | Vous n'avez pas les droits nécessaires |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit avec les données existantes |
| 422 | Unprocessable Entity | Les données ne peuvent pas être traitées |
| 429 | Too Many Requests | Trop de requêtes, veuillez patienter |
| 500 | Internal Server Error | Erreur serveur |
| 503 | Service Unavailable | Service temporairement indisponible |

---

## 💬 Messages utilisateur

### Principes pour les messages

1. **Claire et concis** : Évitez le jargon technique
2. **Actionnable** : Indiquez ce que l'utilisateur peut faire
3. **Rassurant** : N'alarmez pas inutilement
4. **Contexte** : Donnez des informations pertinentes

### Exemples

#### ❌ Mauvais messages
- "Error: ECONNREFUSED"
- "NullPointerException in UserService.java:42"
- "Validation failed"

#### ✅ Bons messages
- "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
- "Une erreur est survenue lors de la création de l'utilisateur. Veuillez réessayer."
- "L'email est requis et doit être au format valide (ex: nom@domaine.fr)"

---

## 🧪 Tests

### Tester les erreurs backend

```typescript
describe('UserController', () => {
  it('should return 400 on invalid email', async () => {
    const dto = { email: 'invalid-email', firstName: 'John', lastName: 'Doe' };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('details');
  });

  it('should return 409 on duplicate email', async () => {
    // Créer un utilisateur
    await userService.create({ email: 'test@afpi.fr', ... });

    // Tenter de créer avec le même email
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@afpi.fr', ... })
      .expect(409);

    expect(response.body.message).toContain('existe déjà');
  });
});
```

### Tester les erreurs frontend

```typescript
describe('UserFormComponent', () => {
  it('should display error message on server error', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    userService.createUser.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(toastr.error).toHaveBeenCalledWith(
      jasmine.stringContaining('erreur serveur'),
      jasmine.any(String),
    );
  });
});
```

---

Une bonne gestion des erreurs = une meilleure expérience utilisateur ! 🎯
