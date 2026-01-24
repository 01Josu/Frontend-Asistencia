import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // Si el token expiró o es inválido
        if (error.status === 401) {
          this.logoutAndRedirect();
        }

        return throwError(() => error);
      })
    );
  }

  private logoutAndRedirect() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('idEmpleado');
    localStorage.removeItem('nombres');
    localStorage.removeItem('apellidos');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
