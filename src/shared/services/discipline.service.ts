import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Discipline } from 'models';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  private readonly BASE_URL = 'http://localhost:8081/api/disciplines';

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
    return this.http.post<Discipline>(this.BASE_URL, discipline);
  }

  updateDiscipline(id: number, discipline: Discipline) {
    return this.http.put<Discipline>(`${this.BASE_URL}/${id}`, discipline);
  }

  deleteDiscipline(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 