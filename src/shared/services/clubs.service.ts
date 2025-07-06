import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { clubs, PaginationParams } from 'models';

@Injectable({
  providedIn: 'root',
})
export class ClubsService {
  private readonly BASE_URL = 'http://localhost:8081/';
  constructor(private http: HttpClient) {}

  public getAllClubs() {
    return this.http.get<clubs[]>(`${this.BASE_URL}api/clubs/all`);
  }
  public getAllClubsPaginated(paginationParams: PaginationParams) {
    const params = new HttpParams();
    params.set('page', paginationParams.page.toString());
    params.set('pageSize', paginationParams.pageSize.toString());
    return this.http.get<clubs[]>(`${this.BASE_URL}api/clubs/all`, { params });
  }
  public createClub(club: clubs) {
    return this.http.post<clubs>(`${this.BASE_URL}api/clubs`, club);
  }
  public updateClub(club: clubs) {
    return this.http.put<clubs>(`${this.BASE_URL}api/clubs/${club.id}`, club);
  }
  public deleteClub(id: number) {
    return this.http.delete(`${this.BASE_URL}api/clubs/${id}`);
  }
}
