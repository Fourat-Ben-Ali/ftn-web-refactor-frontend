import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evenement } from 'models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private readonly BASE_URL = `${environment.apiUrl}/api/evenements`;

  constructor(private http: HttpClient) { }

  getAllEvenements() {
    return this.http.get<Evenement[]>(this.BASE_URL);
  }

  getEvenementById(id: number) {
    return this.http.get<Evenement>(`${this.BASE_URL}/${id}`);
  }

  createEvenement(evenement: Evenement) {
    return this.http.post<Evenement>(this.BASE_URL, evenement);
  }

  updateEvenement(id: number, evenement: Evenement) {
    return this.http.put<Evenement>(`${this.BASE_URL}/${id}`, evenement);
  }

  deleteEvenement(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 