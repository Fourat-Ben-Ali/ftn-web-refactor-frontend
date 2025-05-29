import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Evenement } from 'models';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private readonly BASE_URL = `${environment.apiUrl}/api/evenements`;

  constructor(private http: HttpClient) { }

  getAllEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.BASE_URL);
  }

  getEvenementById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.BASE_URL}/${id}`);
  }

  createEvenement(evenement: Evenement): Observable<Evenement> {
    console.log('Création événement - données envoyées:', evenement);
    return this.http.post<Evenement>(this.BASE_URL, evenement).pipe(
      tap({
        next: (response) => console.log('Création événement - réponse:', response),
        error: (error) => console.error('Création événement - erreur:', error)
      })
    );
  }

  updateEvenement(id: number, evenement: Evenement): Observable<Evenement> {
    console.log('Mise à jour événement - URL:', `${this.BASE_URL}/${id}`);
    console.log('Mise à jour événement - données envoyées:', evenement);
    return this.http.put<Evenement>(`${this.BASE_URL}/${id}`, evenement).pipe(
      tap({
        next: (response) => console.log('Mise à jour événement - réponse:', response),
        error: (error) => console.error('Mise à jour événement - erreur:', error)
      })
    );
  }

  deleteEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
