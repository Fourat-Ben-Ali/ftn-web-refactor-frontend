import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private router: Router) {}

  public getToken(): string | null {
    const userString = localStorage.getItem('user');
    if (!userString) return null;

    try {
      const user = JSON.parse(userString);
      return user.token || null;
    } catch (e) {
      console.error('Erreur de parsing du token :', e);
      return null;
    }
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      return null;
    }
  }

  public redirectByUserRole(): void {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const claims = this.decodeToken(token);
    const roles: string[] = claims?.roles || [];

    if (roles.includes('ADMIN')) {
      this.router.navigate(['/back-office']);
    } else if (roles.includes('USER')) {
      this.router.navigate(['/user/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
