import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Athlete {
  id: number;
  prenom: string;
  nom: string;
  genre: 'MALE' | 'FEMALE';
  dateNaissance: Date;
  nationalite: string;
  club?: {
    id: number;
    clubName: string;
  };
  equipeNationale?: {
    id: number;
    nom: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AthleteService {
  private apiUrl = `${environment.apiUrl}/api/athletes`;

  constructor(private http: HttpClient) {}

  getAllAthletes(): Observable<Athlete[]> {
    return this.http.get<Athlete[]>(this.apiUrl);
  }
} 