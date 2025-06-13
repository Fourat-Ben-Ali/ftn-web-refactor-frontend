import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ActualiteAcademie {
  id: number;
  titre: string;
  contenu: string;
  datePublication?: Date;
  statutPublication: 'PUBLIE' | 'EN_ATTENTE' | 'NON_PUBLIE';
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActualiteAcademieService {
  private apiUrl = `${environment.apiUrl}/api/actualites-academie`;

  constructor(private http: HttpClient) {}

  getAllActualiteAcademies(): Observable<ActualiteAcademie[]> {
    return this.http.get<ActualiteAcademie[]>(this.apiUrl);
  }

  getActualiteAcademieById(id: number) {
    return this.http.get<ActualiteAcademie>(`${this.apiUrl}/${id}`);
  }

  createActualite(actualite: ActualiteAcademie) {
    return this.http.post<ActualiteAcademie>(this.apiUrl, actualite);
  }

  updateActualite(id: number, actualite: ActualiteAcademie) {
    return this.http.put<ActualiteAcademie>(`${this.apiUrl}/${id}`, actualite);
  }

  deleteActualite(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Add other methods as needed
}
