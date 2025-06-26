import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Athlete } from 'models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  private readonly BASE_URL = `${environment.apiUrl}/api/athletes`;

  constructor(private http: HttpClient) {}

  getAllAthletes() {
    return this.http.get<Athlete[]>(this.BASE_URL);
  }

  getAthleteById(id: number) {
    return this.http.get<Athlete>(`${this.BASE_URL}/${id}`);
  }

  getAthletesByClub(clubId: number) {
    return this.http.get<Athlete[]>(`${this.BASE_URL}/club/${clubId}`);
  }

  getAthletesByEquipe(equipeId: number) {
    return this.http.get<Athlete[]>(`${this.BASE_URL}/equipe/${equipeId}`);
  }

  searchAthletes(query: string) {
    return this.http.get<Athlete[]>(`${this.BASE_URL}/search?query=${query}`);
  }

  createAthlete(athlete: Athlete) {
    return this.http.post<Athlete>(this.BASE_URL, athlete);
  }

  updateAthlete(id: number, athlete: Athlete) {
    return this.http.put<Athlete>(`${this.BASE_URL}/${id}`, athlete);
  }

  assignAthleteToEquipe(athleteId: number, equipeId: number) {
    return this.http.put<Athlete>(`${this.BASE_URL}/${athleteId}/assign-equipe/${equipeId}`, {});
  }

  removeAthleteFromEquipe(athleteId: number) {
    return this.http.put<Athlete>(`${this.BASE_URL}/${athleteId}/remove-from-equipe`, {});
  }

  deleteAthlete(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 