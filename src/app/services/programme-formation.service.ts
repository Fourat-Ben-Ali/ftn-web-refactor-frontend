import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';import { StatutPublication } from 'app/shared/models/statut-publication.enum';

export interface ProgrammeFormation {
  id?: number;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statutPublication: StatutPublication;
}

@Injectable({
  providedIn: 'root'
})
export class ProgrammeFormationService {
  private apiUrl = 'http://localhost:8081/api/programme-formations';

  constructor(private http: HttpClient) {}

  getAllProgrammeFormations(): Observable<ProgrammeFormation[]> {
    return this.http.get<ProgrammeFormation[]>(this.apiUrl);
  }

  getProgrammeFormationById(id: number): Observable<ProgrammeFormation> {
    return this.http.get<ProgrammeFormation>(`${this.apiUrl}/${id}`);
  }

  saveProgrammeFormation(programme: ProgrammeFormation): Observable<ProgrammeFormation> {
    return this.http.post<ProgrammeFormation>(this.apiUrl, programme);
  }

  updateProgrammeFormation(id: number, programme: ProgrammeFormation): Observable<ProgrammeFormation> {
    return this.http.put<ProgrammeFormation>(`${this.apiUrl}/${id}`, programme);
  }

  deleteProgrammeFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProgrammeFormations(query: string): Observable<ProgrammeFormation[]> {
    return this.http.get<ProgrammeFormation[]>(`${this.apiUrl}/search?query=${query}`);
  }

  updateProgrammeStatus(id: number, newStatus: StatutPublication): Observable<ProgrammeFormation> {
    return this.http.put<ProgrammeFormation>(`${this.apiUrl}/${id}/statut`, { statutPublication: newStatus });
  }

  getAllStatuses(): Observable<StatutPublication[]> {
    return this.http.get<StatutPublication[]>(`${this.apiUrl}/statuts`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 