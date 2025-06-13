import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Athlete } from '../models/athlete.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AthleteService {
  private apiUrl = `${environment.apiUrl}/api/athletes`;

  constructor(private http: HttpClient) {}

  getAllAthletes(): Observable<Athlete[]> {
    return this.http.get<Athlete[]>(this.apiUrl);
  }

  getAthleteById(id: number): Observable<Athlete> {
    return this.http.get<Athlete>(`${this.apiUrl}/${id}`);
  }

  getAthletesByClub(clubId: number): Observable<Athlete[]> {
    return this.http.get<Athlete[]>(`${this.apiUrl}/club/${clubId}`);
  }

  getAthletes(): Observable<Athlete[]> {
    return this.http.get<Athlete[]>(this.apiUrl);
  }
} 