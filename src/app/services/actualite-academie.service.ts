import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatutPublication } from '../shared/models/statut-publication.enum';
import { environment } from '../../environments/environment';

export interface ActualiteAcademie {


   id?: number;
  titre: string;
  contenu: string;
  datePublication: string;
  statutPublication: StatutPublication;
}

@Injectable({
  providedIn: 'root'
})
export class ActualiteAcademieService {
  private readonly BASE_URL = `${environment.apiUrl}/api/actualite-academies`;

  constructor(private http: HttpClient) { }

  getAllActualiteAcademies() {
    return this.http.get<ActualiteAcademie[]>(this.BASE_URL);
  }
  

  getActualiteAcademieById(id: number) {
    return this.http.get<ActualiteAcademie>(`${this.BASE_URL}/${id}`);
  }

 createActualite(actualite: ActualiteAcademie) {
  
  return this.http.post<ActualiteAcademie>(this.BASE_URL, actualite);
}

  updateActualite(id: number, actualite: ActualiteAcademie) {
    return this.http.put<ActualiteAcademie>(`${this.BASE_URL}/${id}`, actualite);
  }

  deleteActualite(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }

  searchActualites(query: string) {
    return this.http.get<ActualiteAcademie[]>(`${this.BASE_URL}/search?query=${query}`);
  }


  publishActualite(id: number) {
    return this.http.put<ActualiteAcademie>(`${this.BASE_URL}/${id}/statut`,   '"PUBLIE"', // <- envoie exactement "PUBLIE", pas JSON.stringify(...)
    {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    }
  
    );
  }
  getActualitesByStatut(statut: StatutPublication) {
  return this.http.get<ActualiteAcademie[]>(`${this.BASE_URL}/statut/${statut}`);
}
}
