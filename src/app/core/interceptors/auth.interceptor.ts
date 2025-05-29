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
          const user = JSON.parse(userString || '{}');
          token = user?.token;
          console.log('Auth Interceptor - Extracted token:', token ? 'Present' : 'Missing');
          
          if (token) {
            console.log('Auth Interceptor - Adding token to request:', req.url);
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
          } else {
            console.warn('Auth Interceptor - No token found in user object');
          }
        } catch (e) {
          console.error('Auth Interceptor - Error parsing user from localStorage:', e);
        }
      } else {
        console.warn('Auth Interceptor - No user found in localStorage');
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
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
