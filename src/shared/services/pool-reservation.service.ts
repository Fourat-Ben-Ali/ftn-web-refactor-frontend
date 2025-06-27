import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pool } from './pool.service';
import { clubs } from 'models';

export interface PoolReservation {
  id?: number;
  coach: string;
  club: clubs;
  pool: Pool;
  date: string;
  startTime: string;
  endTime: string;
}

export interface PoolReservationFilter {
  coach?: string;
  clubId?: number;
  poolId?: number;
  date?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PoolReservationService {
  private readonly BASE_URL = 'http://localhost:8081/api/pool-reservations';

  constructor(private http: HttpClient) {}

  getAllReservations() {
    return this.http.get<PoolReservation[]>(this.BASE_URL);
  }

  filterReservations(filter: PoolReservationFilter) {
    let params = new URLSearchParams();
    
    if (filter.coach) {
      params.append('coach', filter.coach);
    }
    if (filter.clubId) {
      params.append('clubId', filter.clubId.toString());
    }
    if (filter.poolId) {
      params.append('poolId', filter.poolId.toString());
    }
    if (filter.date) {
      params.append('date', filter.date);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${this.BASE_URL}/filter?${queryString}` : `${this.BASE_URL}/filter`;
    
    return this.http.get<PoolReservation[]>(url);
  }

  createReservation(reservation: PoolReservation) {
    return this.http.post<PoolReservation>(this.BASE_URL, reservation);
  }

  deleteReservation(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
} 