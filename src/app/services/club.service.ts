import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Club } from '../models/club.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = `${environment.apiUrl}/api/clubs`;

  constructor(private http: HttpClient) {}

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }

  getClubById(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }

  getClubAthletes(clubId: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${clubId}/athletes`);
  }
} 