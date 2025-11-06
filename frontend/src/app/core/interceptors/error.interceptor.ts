import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.error('Session expirée. Veuillez vous reconnecter.', 'Erreur');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.toastr.error('Vous n\'avez pas les droits nécessaires.', 'Accès refusé');
        } else if (error.status === 404) {
          this.toastr.error('Ressource introuvable.', 'Erreur 404');
        } else if (error.status >= 500) {
          this.toastr.error('Erreur serveur. Veuillez réessayer plus tard.', 'Erreur');
        } else {
          this.toastr.error(error.error?.message || 'Une erreur est survenue.', 'Erreur');
        }

        return throwError(() => error);
      })
    );
  }
}
