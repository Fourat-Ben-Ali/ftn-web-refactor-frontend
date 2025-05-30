import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContenuPresse } from 'shared/models/DTO/contenu-presseDTO.model';


@Injectable({
  providedIn: 'root'
})
export class PresseService {
  private apiUrl = 'http://localhost:8081/api/contenus'; // adapte le port si nécessaire

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContenuPresse[]> {
    return this.http.get<ContenuPresse[]>(`${this.apiUrl}/ListContenu`);
  }

  getById(id: number): Observable<ContenuPresse> {
    return this.http.get<ContenuPresse>(`${this.apiUrl}/getById/${id}`);
  }

  add(contenu: ContenuPresse): Observable<ContenuPresse> {
    return this.http.post<ContenuPresse>(`${this.apiUrl}/add`, contenu);
  }

  update(id: number, contenu: ContenuPresse): Observable<ContenuPresse> {
    return this.http.put<ContenuPresse>(`${this.apiUrl}/Update/${id}`, contenu);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }
}
