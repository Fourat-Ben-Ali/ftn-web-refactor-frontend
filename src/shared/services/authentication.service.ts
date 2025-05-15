import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from 'models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiUrl = 'http://localhost:8081/';

  constructor(private httpClient: HttpClient) {}

  /**
   * Appel brut de l'API pour authentification (retourne l'Observable)
   */
  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.apiUrl}api/v1/auth/authentication`,
      credentials
    );
  }

  /**
   * Appel l'API, stocke le token dans le localStorage
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
   * Supprimer le token (déconnexion)
   */
  public logout(): void {
    localStorage.removeItem('user');
  }
}
