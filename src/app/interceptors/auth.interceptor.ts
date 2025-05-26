import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', token)
      });
      
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          // Only handle auth errors (401, 403)
          if ((error.status === 401 || error.status === 403) && this.router.url !== '/login') {
            // Only show message if not already on login page
            this.messageService.add({
              severity: 'warn',
              summary: 'Sessão encerrada',
              detail: 'Por favor, faça login novamente.'
            });
            
            // Logout and redirect
            this.authService.logout();
          }
          
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }
}
