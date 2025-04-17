import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) 
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Um erro inesperado ocorreu.' });
        
        if (error.status === 504) 
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Um erro 504 ocorreu. Tentativa de gateway expirou.' });
        
        if (error.status === 500) 
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Um erro 500 ocorreu. Estamos passando por instabilidades.' });

        if (error.status === 400) 
          this.messageService.add({ severity: 'error', summary: 'Error', detail:  error.error && error.error.detail ?  error.error.detail  : 'Um erro inesperado ocorreu.'  });

        if (error.status === 422) 
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: error.error.detail});
        
        
        return throwError(error);
      })
    );
  }
}
