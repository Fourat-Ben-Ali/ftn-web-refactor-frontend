import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Discipline } from 'models';
import { environment } from 'environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  private readonly BASE_URL = `${environment.apiUrl}/api/disciplines`;

  constructor(private http: HttpClient) {}

  getAllDisciplines() {
    return this.http.get<Discipline[]>(this.BASE_URL);
  }

  getDisciplineById(id: number) {
    return this.http.get<Discipline>(`${this.BASE_URL}/${id}`);
  }

  getDisciplineByNom(nom: string) {
    return this.http.get<Discipline>(`${this.BASE_URL}/nom/${nom}`);
  }

  searchDisciplines(query: string) {
    return this.http.get<Discipline[]>(`${this.BASE_URL}/search?query=${query}`);
  }

  createDiscipline(discipline: Discipline) {
    console.log('Création discipline - données envoyées:', discipline);
    return this.http.post<Discipline>(this.BASE_URL, discipline).pipe(
      tap({
        next: (response) => console.log('Création discipline - réponse:', response),
        error: (error) => console.error('Création discipline - erreur:', error)
      })
    );
  }

  updateDiscipline(id: number, discipline: Discipline) {
    console.log('Mise à jour discipline - URL:', `${this.BASE_URL}/${id}`);
    console.log('Mise à jour discipline - données envoyées:', discipline);
    return this.http.put<Discipline>(`${this.BASE_URL}/${id}`, discipline).pipe(
      tap({
        next: (response) => console.log('Mise à jour discipline - réponse:', response),
        error: (error) => console.error('Mise à jour discipline - erreur:', error)
      })
    );
  }

  deleteDiscipline(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 