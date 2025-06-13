import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EquipeNationale {
  id: number;
  nom: string;
  description?: string;
  dateCreation?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EquipeNationaleService {
  private apiUrl = `${environment.apiUrl}/api/equipes-nationales`;

  constructor(private http: HttpClient) {}

  getAllEquipes(): Observable<EquipeNationale[]> {
    return this.http.get<EquipeNationale[]>(this.apiUrl);
  }
} 