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

  public getRoles(): string[] {
    const token: string | null = this.getToken();
    if (!token) return [];

    const payload = this.decodeToken(token);
    return payload?.roles || [];
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
      this.router.navigate(['/auth']);
      return;
    }
    const roles: string[] = this.getRoles();

    if (roles.includes('ADMIN')) {
      this.router.navigate(['/back-office/admin']);
    } else if (roles.includes('CLUB_MANAGER')) {
      this.router.navigate(['/back-office/manager']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
