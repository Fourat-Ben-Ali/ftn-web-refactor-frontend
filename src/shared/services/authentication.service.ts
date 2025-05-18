import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from 'models';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiUrl = 'http://localhost:8081/';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Appel brut de l'API pour authentification (retourne l'Observable)
   * @param credentials
   * @returns {Observable<LoginResponse>} Observable de la réponse de l'API
   */
  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.apiUrl}api/v1/auth/authentication`,
      credentials
    );
  }

  /**
   * Appel l'API, stocke le token dans le localStorage
   * @param credentials: LoginRequest
   * @returns {Observable<LoginResponse>} Observable de la réponse de l'API
   */
  public authenticateAndStoreToken(
    credentials: LoginRequest
  ): Observable<LoginResponse> {
    return this.login(credentials).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('user', JSON.stringify(response));
      })
    );
  }

  /**
   * retourne l'utilisateur connecté
   * @returns {LoginResponse}
   */
  getUser(): LoginResponse | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error("Erreur de parsing de l'utilisateur :", e);
      }
    }
    return null;
  }

  /**
   * Return username from localStorage
   * @returns {string} username
   *  */
  public getUsername(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }
    const user: LoginResponse | null = this.getUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  }

  public isAuthenticated(): boolean {
    const user = this.getUser();
    if (!user) {
      return false;
    }
    const token = user.token;
    if (!token) {
      return false;
    }
    const payload = this.decodeToken(token);
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate > new Date();
  }

  /**
   * Décoder le token JWT
   * @param token
   * @returns {any} le payload du token
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      return null;
    }
  }

  /**
   * Supprimer le token (déconnexion)
   */
  public logout(): void {
    localStorage.removeItem('user');
    this.redirectToLogin();
  }

  /**
   * Redirige vers la page de connexion
   * @returns {void}
   * */
  private redirectToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
