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
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private publicUrls = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/authentication'
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if the request URL is in the public URLs list
    const isPublicUrl = this.publicUrls.some(url => req.url.includes(url));

    // If it's a public URL, proceed without adding the token
    if (isPublicUrl) {
      return next.handle(req);
    }

    let token: string | null = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    } else {
      console.warn('No token found in AuthService');
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized access:', error);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('user');
            this.router.navigate(['/front-office/login']);
          }
        } else if (error.status === 403) {
          console.error('Forbidden access:', error);
          if (isPlatformBrowser(this.platformId)) {
            this.router.navigate(['/front-office/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
