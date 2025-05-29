import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActualiteAcademie } from 'app/services/actualite-academie.service';

@Injectable({
  providedIn: 'root',
})
export class ActualiteAcademieService {
  private readonly BASE_URL = 'http://localhost:8081/api/actualite-academies';

  constructor(private http: HttpClient) {}

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

  // Add other methods as needed
}
