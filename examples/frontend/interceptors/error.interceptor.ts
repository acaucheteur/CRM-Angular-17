// Example: Error Interceptor for Angular Frontend
// Path: frontend/src/app/core/interceptors/error.interceptor.ts

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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // Retry on network errors (except POST/PUT/DELETE)
      retry({
        count: req.method === 'GET' ? 2 : 0,
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
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      this.toastr.error(
        'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        'Erreur réseau',
      );
    } else {
      // Server-side error
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

        case 500:
        case 502:
        case 503:
        case 504:
          this.toastr.error(
            'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
            'Erreur serveur',
          );
          break;

        default:
          this.toastr.error('Une erreur inattendue est survenue', 'Erreur');
      }
    }
  }

  private handleValidationError(error: HttpErrorResponse) {
    if (error.error?.details && Array.isArray(error.error.details)) {
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
