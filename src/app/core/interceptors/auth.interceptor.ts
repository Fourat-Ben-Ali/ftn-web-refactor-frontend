import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      console.log('Auth Interceptor - User from localStorage:', userString);
      
      if (userString) {
        try {
          const user = JSON.parse(userString);
          token = user?.token;
          console.log('Détails de la requête:', {
            url: req.url,
            method: req.method,
            headers: req.headers.keys(),
            body: req.body
          });
          
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            });
            console.log('En-têtes après modification:', {
              url: req.url,
              method: req.method,
              headers: req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`),
              body: req.body
            });
          }
        } catch (e) {
          console.error('Erreur lors du parsing du user:', e);
        }
      } else {
        console.warn('Auth Interceptor - No user found in localStorage');
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('Erreur 403 détectée:', {
            url: error.url,
            message: error.message,
            error: error.error,
            headers: error.headers.keys().map(key => `${key}: ${error.headers.get(key)}`)
          });
        }
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          console.log('Auth Interceptor - 401 Unauthorized, redirecting to auth');
          this.router.navigate(['/auth']);
        } else if (error.status === 403) {
          console.error('Auth Interceptor - 403 Forbidden. Token:', token ? 'Present' : 'Missing');
        }
        return throwError(() => error);
      })
    );
  }
}
