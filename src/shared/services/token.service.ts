import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private router: Router) {}

  public getToken(): string | null {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.warn('Token Service - No user found in localStorage');
      return null;
    }

    try {
      const user = JSON.parse(userString);
      if (!user.token) {
        console.warn('Token Service - No token found in user object');
        return null;
      }
      return user.token;
    } catch (e) {
      console.error('Token Service - Error parsing user from localStorage:', e);
      return null;
    }
  }

  public getRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      console.warn('Token Service - No token available');
      return [];
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload) {
        console.warn('Token Service - Could not decode token');
        return [];
      }

      // Check both authorities and roles fields in the token
      let roles: string[] = [];
      
      if (payload.roles && Array.isArray(payload.roles)) {
        roles = roles.concat(payload.roles);
      }
      if (payload.authorities && Array.isArray(payload.authorities)) {
        roles = roles.concat(payload.authorities);
      }

      // Convert all roles to uppercase for consistent comparison
      roles = roles.map(role => role.toUpperCase());
      
      console.log('Token Service - Decoded roles:', roles);
      return roles;
    } catch (error) {
      console.error('Token Service - Error getting roles:', error);
      return [];
    }
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        console.warn('Token Service - Invalid token format');
        return null;
      }

      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      console.log('Token Service - Decoded payload:', parsedPayload);
      return parsedPayload;
    } catch (error) {
      console.error('Token Service - Error decoding token:', error);
      return null;
    }
  }

  public redirectByUserRole(): void {
    const token = this.getToken();
    if (!token) {
      console.warn('Token Service - No token available for redirect');
      this.router.navigate(['/auth']);
      return;
    }

    const roles = this.getRoles();
    console.log('Token Service - Redirecting based on roles:', roles);

    if (roles.includes('ADMIN')) {
      this.router.navigate(['/back-office/admin']);
    } else if (roles.includes('CLUB_MANAGER')) {
      this.router.navigate(['/back-office/manager']);
    } else {
      console.warn('Token Service - No matching role found for redirect');
      this.router.navigate(['/auth']);
    }
  }
}
