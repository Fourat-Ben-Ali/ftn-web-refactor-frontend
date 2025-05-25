import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EquipeNationale } from 'models';

@Injectable({
  providedIn: 'root',
})
export class EquipeNationaleService {
  private readonly BASE_URL = 'http://localhost:8081/api/equipes-nationales';

  constructor(private http: HttpClient) {}

  getAllEquipesNationales() {
    return this.http.get<EquipeNationale[]>(this.BASE_URL);
  }

  getEquipeNationaleById(id: number) {
    return this.http.get<EquipeNationale>(`${this.BASE_URL}/${id}`);
  }

  getEquipesByDiscipline(disciplineId: number) {
    return this.http.get<EquipeNationale[]>(`${this.BASE_URL}/discipline/${disciplineId}`);
  }

  getEquipeByAthlete(athleteId: number) {
    return this.http.get<EquipeNationale>(`${this.BASE_URL}/athlete/${athleteId}`);
  }

  createEquipeNationale(equipe: EquipeNationale) {
    return this.http.post<EquipeNationale>(this.BASE_URL, equipe);
  }

  updateEquipeNationale(id: number, equipe: EquipeNationale) {
    return this.http.put<EquipeNationale>(`${this.BASE_URL}/${id}`, equipe);
  }

  addAthleteToEquipe(equipeId: number, athleteId: number) {
    return this.http.post<EquipeNationale>(`${this.BASE_URL}/${equipeId}/athletes/${athleteId}`, {});
  }

  removeAthleteFromEquipe(equipeId: number, athleteId: number) {
    return this.http.delete<EquipeNationale>(`${this.BASE_URL}/${equipeId}/athletes/${athleteId}`);
  }

  deleteEquipeNationale(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 