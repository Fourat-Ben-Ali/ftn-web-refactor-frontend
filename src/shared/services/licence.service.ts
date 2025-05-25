import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Licence } from 'models';

@Injectable({
  providedIn: 'root',
})
export class LicenceService {
  private readonly BASE_URL = 'http://localhost:8081/api/licences';

  constructor(private http: HttpClient) {}

  getAllLicences() {
    return this.http.get<Licence[]>(this.BASE_URL);
  }

  getLicenceById(id: number) {
    return this.http.get<Licence>(`${this.BASE_URL}/${id}`);
  }

  getLicencesByAthlete(athleteId: number) {
    return this.http.get<Licence[]>(`${this.BASE_URL}/athlete/${athleteId}`);
  }

  getLicencesByClub(clubId: number) {
    return this.http.get<Licence[]>(`${this.BASE_URL}/club/${clubId}`);
  }

  getActiveLicences(date?: string) {
    const url = date ? `${this.BASE_URL}/active?date=${date}` : `${this.BASE_URL}/active`;
    return this.http.get<Licence[]>(url);
  }

  getExpiredLicences(date?: string) {
    const url = date ? `${this.BASE_URL}/expired?date=${date}` : `${this.BASE_URL}/expired`;
    return this.http.get<Licence[]>(url);
  }

  getFutureLicences(date?: string) {
    const url = date ? `${this.BASE_URL}/future?date=${date}` : `${this.BASE_URL}/future`;
    return this.http.get<Licence[]>(url);
  }

  createLicence(licence: Licence) {
    return this.http.post<Licence>(this.BASE_URL, licence);
  }

  updateLicence(id: number, licence: Licence) {
    return this.http.put<Licence>(`${this.BASE_URL}/${id}`, licence);
  }

  deleteLicence(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 