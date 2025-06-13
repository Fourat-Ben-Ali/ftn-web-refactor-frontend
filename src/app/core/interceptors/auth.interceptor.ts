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
  private publicUrls = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/athletes',
    '/api/clubs'
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
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

    let token: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('currentUser');
      
      if (userString) {
        try {
          const user = JSON.parse(userString);
          token = user?.token;
          
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            });
          }
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/front-office/login']);
        } else if (error.status === 403) {
          if (!isPublicUrl) {
            this.router.navigate(['/front-office/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
