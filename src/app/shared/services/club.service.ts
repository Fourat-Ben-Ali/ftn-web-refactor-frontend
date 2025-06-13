import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Club {
  id: number;
  clubName: string;
  description?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = `${environment.apiUrl}/api/clubs`;

  constructor(private http: HttpClient) {}

  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }
} 