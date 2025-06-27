import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface Evenement {
  id: number;
  titre?: string;
  nom?: string;
  description?: string;
  date?: Date;
  dateDebut?: Date;
  dateFin?: Date;
  typeEvenement?: string;
  discipline?: any;
  lieu?: string;
  statut?: 'PLANIFIE' | 'EN_COURS' | 'TERMINE';
}

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = `${environment.apiUrl}/api/evenements`;

  constructor(private http: HttpClient) {}

  getAllEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.apiUrl);
  }

  getEvenementById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.apiUrl}/${id}`);
  }

  createEvenement(evenement: Evenement): Observable<Evenement> {
    console.log('Création événement - données envoyées:', evenement);
    return this.http.post<Evenement>(this.apiUrl, evenement).pipe(
      tap({
        next: (response) => console.log('Création événement - réponse:', response),
        error: (error) => console.error('Création événement - erreur:', error)
      })
    );
  }

  updateEvenement(id: number, evenement: Evenement): Observable<Evenement> {
    console.log('Mise à jour événement - URL:', `${this.apiUrl}/${id}`);
    console.log('Mise à jour événement - données envoyées:', evenement);
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, evenement).pipe(
      tap({
        next: (response) => console.log('Mise à jour événement - réponse:', response),
        error: (error) => console.error('Mise à jour événement - erreur:', error)
      })
    );
  }

  deleteEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
